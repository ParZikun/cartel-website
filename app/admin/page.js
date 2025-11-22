'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Database, ChevronLeft, ChevronRight, X, Eye, CheckCircle, AlertCircle, Clock, Copy, BarChart4 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function AdminPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/get-all-deals?page=${page}&limit=10`);
            if (!response.ok) throw new Error('Failed to fetch deals');
            const data = await response.json();
            setListings(data.data || []);
            setPagination(data.pagination || { page: 1, limit: 10, total: 0, total_pages: 0 });
        } catch (error) {
            console.error("Error fetching deals:", error);
            toast.error('Failed to load deals', {
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.page);
    }, [pagination.page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const copyToClipboard = (e, text) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!', {
            description: `Mint: ${text.substring(0, 8)}...`
        });
    };

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
                    <button
                        onClick={() => fetchData(pagination.page)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
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
                                <th className="p-4 font-medium">Name / Mint</th>
                                <th className="p-4 font-medium">Alt Value</th>
                                <th className="p-4 font-medium">Price (SOL / USD)</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Cartel Tier</th>
                                <th className="p-4 font-medium">Last Scan</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-400">Loading...</td>
                                </tr>
                            ) : listings.map((item) => (
                                <tr
                                    key={item.id || item.token_mint}
                                    onClick={() => setSelectedItem(item)}
                                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{item.name || 'Unknown Item'}</span>
                                            <button
                                                onClick={(e) => copyToClipboard(e, item.token_mint)}
                                                className="font-mono text-xs text-gray-500 hover:text-accent-gold transition-colors text-left flex items-center gap-1"
                                                title="Click to copy mint"
                                            >
                                                {item.token_mint ? `${item.token_mint.substring(0, 6)}...` : 'No Mint'}
                                                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-white">{item.alt_value != null ? Number(item.alt_value).toFixed(2) : '-'}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-accent-gold">{item.price_amount != null ? Number(item.price_amount).toFixed(2) : '0.00'} SOL</span>
                                            <span className="text-xs text-gray-500">≈ ${(item.price_amount * 150).toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${item.is_listed
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                        `}>
                                            {item.is_listed ? 'Listed' : 'Unlisted'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${item.cartel_category === 'AUTOBUY'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}
                                        `}>
                                            {item.cartel_category === 'AUTOBUY' && <AlertCircle className="w-3 h-3" />}
                                            {item.cartel_category || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Clock className="w-3 h-3" />
                                            <span className="font-mono">{item.listed_at ? new Date(item.listed_at).toLocaleTimeString() : '-'}</span>
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
                        Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span> results
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-400 px-2">Page {pagination.page} of {pagination.total_pages || 1}</span>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.total_pages}
                            className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Inspection Panel (Pokedex-Style Slide-Over) */}
            <div
                className={`
                    fixed inset-y-0 right-0 w-full md:w-[700px] bg-gradient-to-br from-[#0c0a15] via-[#1a1625] to-[#0c0a15] border-l-2 border-accent-gold/30 shadow-2xl transform transition-transform duration-300 ease-in-out z-50
                    ${selectedItem ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col relative overflow-hidden">
                    {/* Pokedex Header with Scanline Effect */}
                    <div className="relative p-6 border-b-2 border-accent-gold/20 bg-black/40">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-gold/5 animate-pulse"></div>
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent-gold/20 border-2 border-accent-gold flex items-center justify-center">
                                    <Database className="w-6 h-6 text-accent-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-accent-gold tracking-wide">CARD DATABASE</h2>
                                    <p className="text-xs text-gray-400 font-mono mt-1">ID: {selectedItem?.token_mint?.substring(0, 8)}...</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {selectedItem && (
                            <>
                                {/* Card Display Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image */}
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-accent-gold/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-accent-gold/30 bg-black/40 shadow-2xl">
                                            <Image
                                                src={selectedItem.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=No+Image'}
                                                alt={selectedItem.name || 'Card'}
                                                fill
                                                className="object-contain p-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Main Info */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white leading-tight mb-2">{selectedItem.name}</h3>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-bold border-2
                                                    ${selectedItem.is_listed
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/40'
                                                        : 'bg-gray-500/20 text-gray-400 border-gray-500/40'}
                                                `}>
                                                    {selectedItem.is_listed ? '● LISTED' : '○ UNLISTED'}
                                                </span>
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-bold border-2
                                                    ${selectedItem.cartel_category === 'AUTOBUY'
                                                        ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                                                        : selectedItem.cartel_category === 'GOOD'
                                                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                                            : 'bg-purple-500/20 text-purple-400 border-purple-500/40'}
                                                `}>
                                                    {selectedItem.cartel_category || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price & Value Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-accent-gold/10 to-accent-gold/5 border border-accent-gold/30">
                                                <p className="text-xs text-accent-gold/70 uppercase tracking-wider font-bold mb-1">Listing Price</p>
                                                <p className="text-2xl font-mono text-accent-gold font-bold">{Number(selectedItem.price_amount).toFixed(2)}</p>
                                                <p className="text-xs text-accent-gold/50 font-mono">SOL</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">ALT Value</p>
                                                <p className="text-2xl font-mono text-white font-bold">{Number(selectedItem.alt_value).toFixed(2)}</p>
                                                <p className="text-xs text-gray-500 font-mono">USD</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/30">
                                                <p className="text-xs text-blue-400 uppercase tracking-wider font-bold mb-1">Cartel AVG</p>
                                                <p className="text-xl font-mono text-blue-300 font-bold">{Number(selectedItem.avg_price).toFixed(2)}</p>
                                                <p className="text-xs text-blue-500/70 font-mono">USD</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30">
                                                <p className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">Supply</p>
                                                <p className="text-xl font-mono text-purple-300 font-bold">{selectedItem.supply || 'N/A'}</p>
                                                <p className="text-xs text-purple-500/70 font-mono">POP</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grading Information */}
                                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                    <h4 className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Grading Information
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Company</p>
                                            <p className="text-sm text-white font-bold">{selectedItem.grading_company || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Grade</p>
                                            <p className="text-sm text-white font-bold">{selectedItem.grade || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Grade #</p>
                                            <p className="text-sm text-white font-mono">{selectedItem.grade_num || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase mb-1">Cert ID</p>
                                            <p className="text-sm text-white font-mono">{selectedItem.grading_id || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ALT Data Section */}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-accent-gold/5 to-transparent border border-accent-gold/20">
                                    <h4 className="text-sm font-bold text-accent-gold uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <BarChart4 className="w-4 h-4" />
                                        ALT.xyz Analytics
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Value Range</p>
                                            <p className="text-sm text-white font-mono">
                                                ${Number(selectedItem.alt_value_lower_bound).toFixed(2)} - ${Number(selectedItem.alt_value_upper_bound).toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Confidence</p>
                                            <p className="text-sm text-white font-bold">{selectedItem.alt_value_confidence || 'N/A'}%</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/40 border border-white/5 col-span-2">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Asset ID</p>
                                            <p className="text-sm text-white font-mono truncate">{selectedItem.alt_asset_id || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Additional Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Category</p>
                                            <p className="text-sm text-white">{selectedItem.category || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Insured Value</p>
                                            <p className="text-sm text-white font-mono">${selectedItem.insured_value || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Listed At</p>
                                            <p className="text-sm text-white font-mono">{selectedItem.listed_at ? new Date(selectedItem.listed_at).toLocaleString() : 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Last Analyzed</p>
                                            <p className="text-sm text-white font-mono">{selectedItem.last_analyzed_at ? new Date(selectedItem.last_analyzed_at).toLocaleString() : 'N/A'}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-black/20 border border-white/5 col-span-2">
                                            <p className="text-xs text-gray-500 uppercase mb-1">Listing ID</p>
                                            <p className="text-sm text-white font-mono truncate">{selectedItem.listing_id || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t-2 border-accent-gold/20 bg-black/40 flex gap-3">
                        <button className="flex-1 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-yellow-600 text-black font-bold hover:from-accent-gold/90 hover:to-yellow-600/90 transition-all shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)] flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Open in Explorer
                        </button>
                        <button className="flex-1 py-3 rounded-lg bg-white/10 text-white font-bold hover:bg-white/20 transition-colors border border-white/20 flex items-center justify-center gap-2">
                            <Database className="w-4 h-4" />
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
