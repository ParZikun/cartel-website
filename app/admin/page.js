'use client';

import { useState } from 'react';
import { Search, RefreshCw, Database, ChevronLeft, ChevronRight, X, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Image from 'next/image';

// Dummy Data
const DUMMY_DATA = Array.from({ length: 10 }).map((_, i) => ({
    id: `mint-${i}`,
    name: `Pokemon Card #${100 + i}`,
    mint: `7xKX...${Math.random().toString(36).substring(7)}`,
    price: (Math.random() * 10).toFixed(2),
    status: Math.random() > 0.5 ? 'Listed' : 'Sold',
    tier: Math.random() > 0.7 ? 'S-Tier' : 'A-Tier',
    lastScan: new Date(Date.now() - Math.random() * 10000000).toISOString(),
    img_url: 'https://placehold.co/100x140/0c0a15/2d3748?text=Card',
    raw_data: {
        attributes: {
            set: 'Base Set',
            rarity: 'Rare Holo',
            artist: 'Ken Sugimori'
        },
        market_data: {
            volume_24h: 12.5,
            floor_price: 4.2
        }
    }
}));

export default function AdminPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div className="w-full h-full p-6 space-y-6 relative">
            {/* Top Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Find Card by Mint ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-base text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium">
                        <RefreshCw className="w-4 h-4" />
                        <span>Re-check Skipped</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium">
                        <Database className="w-4 h-4" />
                        <span>Full Database Sync</span>
                    </button>
                </div>
            </div>

            {/* Data Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Thumbnail</th>
                                <th className="p-4 font-medium">Name / Mint</th>
                                <th className="p-4 font-medium">Price (SOL)</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Cartel Tier</th>
                                <th className="p-4 font-medium">Last Scan</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {DUMMY_DATA.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => setSelectedItem(item)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4">
                                        <div className="w-12 h-16 relative rounded-md overflow-hidden border border-white/10 bg-black/20">
                                            <Image
                                                src={item.img_url}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{item.name}</span>
                                            <span className="font-mono text-xs text-gray-500">{item.mint}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-accent-gold">{item.price}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${item.status === 'Listed'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                        `}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${item.tier === 'S-Tier'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}
                                        `}>
                                            {item.tier === 'S-Tier' && <AlertCircle className="w-3 h-3" />}
                                            {item.tier}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Clock className="w-3 h-3" />
                                            <span className="font-mono">{new Date(item.lastScan).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
                    <span className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">10</span> of <span className="font-medium text-white">128</span> results
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-400 px-2">Page 1 of 13</span>
                        <button className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Inspection Panel (Slide-Over) */}
            <div
                className={`
                    fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#0c0a15] border-l border-accent-gold/20 shadow-2xl transform transition-transform duration-300 ease-in-out z-50
                    ${selectedItem ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                        <div>
                            <h2 className="text-xl font-bold text-white">Inspection Details</h2>
                            <p className="text-sm text-gray-400 font-mono mt-1">{selectedItem?.mint}</p>
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {selectedItem && (
                            <>
                                {/* Card Preview */}
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 h-32 relative rounded-lg overflow-hidden border border-white/10 bg-black/20 flex-shrink-0">
                                        <Image
                                            src={selectedItem.img_url}
                                            alt={selectedItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{selectedItem.name}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-1 rounded bg-accent-gold/10 text-accent-gold text-xs font-bold border border-accent-gold/20">
                                                {selectedItem.price} SOL
                                            </span>
                                            <span className="px-2 py-1 rounded bg-white/5 text-gray-300 text-xs border border-white/10">
                                                {selectedItem.tier}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Raw Data */}
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Raw JSON Data
                                    </h3>
                                    <div className="bg-black/40 rounded-xl border border-white/10 p-4 overflow-x-auto">
                                        <pre className="font-mono text-xs text-green-400 leading-relaxed">
                                            {JSON.stringify(selectedItem, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-black/20 flex gap-3">
                        <button className="flex-1 py-3 rounded-lg bg-accent-gold text-black font-bold hover:bg-accent-gold/90 transition-colors">
                            Open in Explorer
                        </button>
                        <button className="flex-1 py-3 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10">
                            Refresh Metadata
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop for Inspection Panel */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
