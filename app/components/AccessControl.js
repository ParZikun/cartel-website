'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '../../context/AuthContext';
import { Loader, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AccessControl({ children }) {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();
    const { user, login_with_wallet, isAuthenticated, isLoading, isSigningIn } = useAuth();

    // 1. Global Loading State (Wallet or Auth)
    if (isLoading && connected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0c0a15]">
                <Loader className="w-8 h-8 text-accent-gold animate-spin" />
            </div>
        );
    }

    // 2. Disconnected State -> Connect Wallet
    if (!connected) {
        return (
            <div className="relative min-h-screen bg-[#0c0a15] flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Image src="/logo.png" alt="Background" width={600} height={600} className="w-auto h-auto grayscale" />
                </div>

                <div className="z-10 bg-black/40 backdrop-blur-xl border border-accent-gold/20 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-accent-gold/10 rounded-2xl flex items-center justify-center border border-accent-gold/30">
                            <Lock className="w-10 h-10 text-accent-gold" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl text-white text-pixel">Access Restricted</h1>
                        <p className="text-gray-400">
                            Please connect your whitelisted wallet to access the CCPS dashboard.
                        </p>
                    </div>

                    <button
                        onClick={() => setVisible(true)}
                        className="w-full py-4 bg-accent-gold text-black font-bold rounded-xl hover:bg-accent-gold-light transition-colors flex items-center justify-center gap-2"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    // 3. Connected but Not Authenticated -> Sign In Required
    if (connected && !isAuthenticated) {
        return (
            <div className="relative min-h-screen bg-[#0c0a15] flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Image src="/logo.png" alt="Background" width={600} height={600} className="w-auto h-auto grayscale" />
                </div>

                <div className="z-10 bg-black/40 backdrop-blur-xl border border-accent-gold/20 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-accent-gold/10 rounded-2xl flex items-center justify-center border border-accent-gold/30">
                            <Lock className="w-10 h-10 text-accent-gold" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl text-white text-pixel">Authentication Required</h1>
                        <p className="text-gray-400">
                            Please sign the message to verify your wallet ownership.
                        </p>
                    </div>

                    <button
                        onClick={login_with_wallet}
                        disabled={isSigningIn}
                        className="w-full py-4 bg-accent-gold text-black font-bold rounded-xl hover:bg-accent-gold-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSigningIn ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // 4. Authenticated but Unauthorized/Blocked
    if (user && (user.tier === 'UNAUTHORIZED' || user.tier === 'BLOCKED' || user.tier === 'PENDING')) {
        return (
            <div className="relative min-h-screen bg-[#0c0a15] flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <Image src="/logo.png" alt="Background" width={600} height={600} className="w-auto h-auto grayscale" />
                </div>

                <div className="z-10 bg-black/40 backdrop-blur-xl border border-red-500/20 p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/30">
                            <Lock className="w-10 h-10 text-red-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl text-white text-pixel">Access Denied</h1>
                        <p className="text-gray-400">
                            Your wallet is <strong>{user.tier}</strong>.
                        </p>
                    </div>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-left space-y-3">
                        <p className="text-gray-300">
                            Contact <span className="text-accent-gold font-bold">The Developer aka ParZi</span> to request access.
                        </p>
                        <div className="flex gap-3 justify-center pt-2">
                            <Link href="https://x.com/ParzivalKun" target="_blank" className="p-2 bg-black/50 rounded-lg hover:text-accent-gold transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </Link>
                            <Link href="https://discord.com/users/502795633422368768" target="_blank" className="p-2 bg-black/50 rounded-lg hover:text-accent-gold transition-colors">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 5. Allowed State
    return <>{children}</>;
}
