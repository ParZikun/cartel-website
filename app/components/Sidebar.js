'use client'

import { X, LayoutGrid, Search, UserCog } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { name: 'Deals', href: '/', icon: LayoutGrid },
  { name: 'Inspect', href: '/inspect', icon: Search },
  { name: 'Admin', href: '/admin', icon: UserCog },
]

export default function Sidebar({ onClose }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 flex-shrink-0 h-full bg-primary-bg/90 backdrop-blur-lg border-r border-accent-gold/10 flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-pixel-lg text-accent-gold">CARDS</h2>
        <button onClick={onClose} className="lg:hidden text-primary-text/70 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition-colors ${
              pathname === item.href
                ? 'bg-accent-gold text-primary-bg font-semibold'
                : 'text-primary-text/80 hover:bg-white/10'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}