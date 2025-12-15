"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { publicKey, signMessage, disconnect } = useWallet();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const router = useRouter();

    // Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("cc_auth_token");
        const storedUser = localStorage.getItem("cc_user");

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Failed to parse stored user", e);
                logout();
            }
        }
        setIsLoading(false);
    }, []);

    // Monitor Wallet Disconnect
    useEffect(() => {
        if (!publicKey && isAuthenticated) {
            // Optional: Auto-logout on wallet disconnect?
            // For now, let's keep the session alive even if wallet disconnects temporarily,
            // unless we want strict binding.
            // Let's NOT auto-logout to prevent annoyance on refresh if adapter is slow.
        }
    }, [publicKey, isAuthenticated]);

    const login_with_wallet = async () => {


        if (!publicKey) {
            toast.error("Please connect your wallet first!");

            return;
        }
        if (!signMessage) {
            toast.error("Wallet does not support message signing!");
            return;
        }

        try {
            const messageContent = `Sign in to Cards Cartel: ${new Date().getTime()}`;
            const message = new TextEncoder().encode(messageContent);

            const signature = await signMessage(message);

            // Enable loading state ONLY after user interaction (signing) is complete
            // This prevents the button from disabling/re-rendering while the popup is opening,
            // which caused the extension to close unexpectedly.
            setIsSigningIn(true);

            const signatureBase58 = bs58.encode(signature);
            const walletAddress = publicKey.toBase58();

            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    message: messageContent,
                    signature: signatureBase58,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Login failed");
            }

            const data = await response.json();

            // Save state
            setToken(data.access_token);
            setUser(data.user);
            setIsAuthenticated(true);

            localStorage.setItem("cc_auth_token", data.access_token);
            localStorage.setItem("cc_user", JSON.stringify(data.user));

            toast.success("Successfully signed in!");

        } catch (error) {
            console.error("Login Error:", error);
            // Ignore "User rejected the request" error to avoid spamming toast
            if (error.message && error.message.includes("User rejected")) {
                toast.info("Signature request cancelled");
            } else {
                toast.error(error.message || "Failed to sign in");
            }
        } finally {
            setIsSigningIn(false);
        }
    };

    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("cc_auth_token");
        localStorage.removeItem("cc_user");
        disconnect();
        toast.info("Logged out");
        router.push('/');
    }, [disconnect, router]);

    // Authenticated Fetch Wrapper
    const authFetch = async (url, options = {}) => {
        if (!token) {
            throw new Error("No auth token");
        }

        const headers = {
            ...options.headers,
            "Authorization": `Bearer ${token}`
        };

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            logout();
            throw new Error("Session expired");
        }

        return response;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isSigningIn,
                isAuthenticated,
                login: login_with_wallet, // For Navbar
                login_with_wallet,        // For AccessControl
                logout,
                authFetch
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
