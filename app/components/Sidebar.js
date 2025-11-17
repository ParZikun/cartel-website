'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Deals', href: '/', icon: '💰' },
  { name: 'Inspect', href: '/inspect', icon: '🔍' },
  { name: 'Admin', href: '/admin', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Card Cartel
      </div>
      <nav className="mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="px-4">
              <Link
                href={item.href}
                className={`flex items-center p-3 my-1 rounded-lg transition-colors
                  ${
                    pathname === item.href
                      ? 'bg-gray-700 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <span className="mr-4 text-2xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
