'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Shield, Settings, X } from 'lucide-react'
import { useUI } from '../context/UIContext'

const navigation = [
    { name: 'Deals', href: '/', icon: Home },
    { name: 'Holdings', href: '/holdings', icon: Briefcase },
    { name: 'Admin', href: '/admin', icon: Shield },
    { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { isSidebarOpen, closeSidebar } = useUI();

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-[60] w-64 glass border-r border-accent-gold/20 transform transition-transform duration-300 ease-in-out flex flex-col
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex-1 flex flex-col pt-24 pb-4 overflow-y-auto">
                    {/* Mobile Close Button */}
                    <div className="absolute top-4 right-4">
                        <button onClick={closeSidebar} className="p-2 text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="mt-5 flex-1 px-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={closeSidebar}
                                    className={`
                                        group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                                        ${isActive
                                            ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30 shadow-[0_0_15px_-5px_rgba(255,215,0,0.3)]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-accent-gold' : 'text-gray-500 group-hover:text-gray-300'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </>
    )
}
