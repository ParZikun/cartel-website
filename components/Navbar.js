'use client'

import Image from 'next/image'
import { Wallet } from 'lucide-react'
import WalletButton from '../app/components/WalletButton'

export default function Navbar() {
    return (
        <header className="fixed top-0 z-50 w-full glass border-b border-accent-gold/20 h-20">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                {/* Left: Logo and Title */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent-gold/10 border border-accent-gold/30">
                        <Image src="/logo.png" alt="CCP-S Logo" width={28} height={28} />
                    </div>
                    <div className="pokemon-title hidden sm:block">
                        <h1 className="pokemon-title-solid font-pokemon text-2xl text-accent-gold">
                            CCP-S
                        </h1>
                        <h1 className="pokemon-title-outline font-pokemon-hollow text-2xl">
                            CCP-S
                        </h1>
                    </div>
                </div>

                {/* Right: Connectivity and Wallet */}
                <div className="flex items-center space-x-6">
                    {/* Connectivity Status */}
                    <div className="group relative flex items-center cursor-help">
                        <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                            </span>
                            <span className="text-xs font-medium text-gray-300">Connected</span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute top-full right-0 mt-2 w-48 p-3 rounded-lg glass border border-accent-gold/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                            <div className="space-y-2 text-xs text-gray-300">
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <span className="text-green-400">Operational</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ping:</span>
                                    <span className="text-accent-gold">24ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Region:</span>
                                    <span>US-East</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Button */}
                    <WalletButton />
                </div>
            </div>
        </header>
    )
}
