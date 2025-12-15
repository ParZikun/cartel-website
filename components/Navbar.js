'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Wallet, Menu } from 'lucide-react'
import WalletButton from '../app/components/WalletButton'
import { useState, useEffect } from 'react'
import { useUI } from '../context/UIContext'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '@solana/wallet-adapter-react'

export default function Navbar() {
    const { toggleSidebar } = useUI();
    const { login, logout, isAuthenticated, isLoading } = useAuth();
    const { publicKey } = useWallet();
    const [healthStatus, setHealthStatus] = useState('unknown'); // unknown, healthy, error

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // Simulating health check since /api/health might not exist yet
                // In real app: await fetch('/api/health')
                setHealthStatus('healthy');
            } catch (error) {
                setHealthStatus('error');
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="fixed top-0 z-50 w-full glass border-b border-accent-gold/20 h-20">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                {/* Left: Logo and Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-gold/10 border border-accent-gold/30 flex-shrink-0">
                            <Image src="/logo.png" alt="CCP-S Logo" width={24} height={24} className="w-auto h-auto" />
                        </div>
                        <div className="pokemon-title hidden sm:block">
                            <h1 className="pokemon-title-solid font-pokemon text-xl text-accent-gold whitespace-nowrap">
                                CCPS
                            </h1>
                            <h1 className="pokemon-title-outline font-pokemon-hollow text-xl whitespace-nowrap">
                                CCPS
                            </h1>
                        </div>
                    </Link>
                </div>

                {/* Right: Connectivity and Wallet */}
                <div className="flex items-center gap-3 sm:gap-6">
                    {/* Connectivity Status */}
                    <div className="group relative flex items-center cursor-help">
                        <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <span className="relative flex h-2.5 w-2.5">
                                {healthStatus === 'healthy' && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                {healthStatus === 'unknown' && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${healthStatus === 'healthy' ? 'bg-green-500' :
                                    healthStatus === 'unknown' ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                            </span>
                            <span className="text-xs font-medium text-gray-300 hidden sm:block">
                                {healthStatus === 'healthy' ? 'Connected' : healthStatus === 'unknown' ? 'Connecting' : 'Error'}
                            </span>
                        </div>
                    </div>

                    {/* Wallet Button */}
                    <div className="flex items-center gap-2">
                        {publicKey && !isAuthenticated && (
                            <button
                                onClick={login}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-bold text-black bg-accent-gold rounded-lg hover:bg-yellow-400 disabled:opacity-50 transition-colors"
                            >
                                {isLoading ? 'Signing...' : 'SIGN IN'}
                            </button>
                        )}
                        {isAuthenticated && (
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-xs font-mono text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-colors"
                            >
                                LOGOUT
                            </button>
                        )}
                        <WalletButton />
                    </div>
                </div>
            </div>
        </header>
    )
}
