'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Database, ChevronLeft, ChevronRight, X, Eye, CheckCircle, AlertCircle, Clock, Copy, BarChart4, Tag, Users, Package } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getConfidenceColor } from '../utils/format';

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
            {/* Top Action Bar - REMOVED as per user request */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm hidden">
                {/* Content removed */}
            </div>

            {/* Data Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/40 border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-2 md:p-4 font-medium">Name / Mint</th>
                                <th className="p-2 md:p-4 font-medium hidden md:table-cell">Alt Value</th>
                                <th className="p-2 md:p-4 font-medium">Price (SOL / USD)</th>
                                <th className="p-2 md:p-4 font-medium">Status</th>
                                <th className="p-2 md:p-4 font-medium hidden md:table-cell">Cartel Tier</th>
                                <th className="p-2 md:p-4 font-medium hidden lg:table-cell">Last Scan</th>
                                <th className="p-2 md:p-4 font-medium text-right hidden sm:table-cell">Actions</th>
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
                                    <td className="p-2 md:p-4 max-w-[120px] sm:max-w-none">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white line-clamp-2 text-sm md:text-base">{item.name || 'Unknown Item'}</span>
                                            <button
                                                onClick={(e) => copyToClipboard(e, item.token_mint)}
                                                className="font-mono text-[10px] md:text-xs text-gray-500 hover:text-accent-gold transition-colors text-left flex items-center gap-1 mt-1"
                                                title="Click to copy mint"
                                            >
                                                {item.token_mint ? `${item.token_mint.substring(0, 6)}...` : 'No Mint'}
                                                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-2 md:p-4 hidden md:table-cell">
                                        <span className="font-mono text-white">{item.alt_value != null ? Number(item.alt_value).toFixed(2) : '-'}</span>
                                    </td>
                                    <td className="p-2 md:p-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-accent-gold text-sm md:text-base">{item.price_amount != null ? Number(item.price_amount).toFixed(2) : '0.00'} SOL</span>
                                            <span className="text-[10px] md:text-xs text-gray-500">≈ ${(item.price_amount * 150).toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="p-2 md:p-4">
                                        <span className={`
                                            inline-flex items-center px-2 py-0.5 md:px-2.5 rounded-full text-[10px] md:text-xs font-medium border whitespace-nowrap
                                            ${item.is_listed
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                        `}>
                                            {item.is_listed ? 'Listed' : 'Unlisted'}
                                        </span>
                                    </td>
                                    <td className="p-2 md:p-4 hidden md:table-cell">
                                        <span className={`
                                            inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap
                                            ${item.cartel_category === 'AUTOBUY'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}
                                        `}>
                                            {item.cartel_category === 'AUTOBUY' && <AlertCircle className="w-3 h-3" />}
                                            {item.cartel_category || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="p-2 md:p-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <Clock className="w-3 h-3" />
                                            <span className="font-mono">{item.listed_at ? new Date(item.listed_at).toLocaleTimeString() : '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-2 md:p-4 text-right hidden sm:table-cell">
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

            {/* Inspection Panel (Polished Design V2) */}
            <div
                className={`
                    fixed inset-y-0 right-0 w-full md:w-[800px] bg-[#0c0a15]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out z-[60]
                    ${selectedItem ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {selectedItem && (
                    <div className="h-full flex flex-col p-6 md:p-8 overflow-y-auto md:overflow-hidden">
                        {/* Header: Title & Close */}
                        <div className="flex items-start justify-between mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-lg drop-shadow-md pr-4">{selectedItem.name}</h2>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:rotate-90 duration-300 flex-shrink-0"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 overflow-visible md:overflow-hidden">
                            {/* Left Col: Image */}
                            <div className="md:col-span-5 relative h-[400px] md:h-full md:max-h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/5 to-transparent shadow-2xl group flex-shrink-0">
                                <div className="absolute inset-0 bg-accent-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <Image
                                    src={selectedItem.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=No+Image'}
                                    alt={selectedItem.name || 'Card'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 w-auto h-auto"
                                />
                            </div>

                            {/* Right Col: Data */}
                            <div className="md:col-span-7 space-y-6 md:overflow-y-auto pr-2 custom-scrollbar">

                                {/* Meta Info Section (Moved Above Metrics) */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 shadow-inner max-w-full overflow-hidden">
                                            <span className="text-sm font-mono text-accent-gold tracking-wider truncate">
                                                {selectedItem.token_mint}
                                            </span>
                                            <button
                                                onClick={(e) => copyToClipboard(e, selectedItem.token_mint)}
                                                className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                                title="Copy Mint"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${selectedItem.is_listed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                {selectedItem.is_listed ? 'Listed' : 'Unlisted'}
                                            </span>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${selectedItem.cartel_category === 'AUTOBUY' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                                                {selectedItem.cartel_category || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex gap-3">
                                            <a href={selectedItem.alt_asset_id ? `https://app.alt.xyz/research/${selectedItem.alt_asset_id}` : '#'} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="ALT.xyz">
                                                <Image src="https://cdn.prod.website-files.com/62829b28e6300b34ff739f02/629661dd02bdba04fb424173_ALT-white-logo.png" width={20} height={20} alt="ALT" />
                                            </a>
                                            <a href={`https://collectorcrypt.com/assets/solana/${selectedItem.token_mint}`} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="Collector Crypt">
                                                <Image src="https://www.marketbeat.com/logos/cryptocurrencies/collector-crypt-CARDS.png?v=2025-09-12" width={20} height={20} className="rounded-full bg-white p-[1px]" alt="CC" />
                                            </a>
                                            <a href={`https://magiceden.io/item-details/${selectedItem.token_mint}`} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="Magic Eden">
                                                <Image src="https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/637db1043720a3ea88e4ea96_public.png" width={20} height={20} alt="ME" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Metrics (Darker & Icons) */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-white/10 hover:border-white/20 transition-colors group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Tag className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1 group-hover:text-white transition-colors">Price</p>
                                        <p className="text-2xl font-bold text-white">{Number(selectedItem.price_amount).toFixed(2)} <span className="text-sm text-gray-500 font-normal">SOL</span></p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-green-500/20 hover:border-green-500/40 transition-colors group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <BarChart4 className="w-6 h-6 text-green-500" />
                                        </div>
                                        <p className="text-[10px] text-green-400 uppercase tracking-wider font-bold mb-1">Alt Value</p>
                                        <p className="text-2xl font-bold text-green-400">${Number(selectedItem.alt_value).toFixed(2)}</p>
                                        <p className="text-xs text-green-500/60 font-mono mt-1">
                                            (${Number(selectedItem.alt_value_lower_bound).toFixed(0)} - ${Number(selectedItem.alt_value_upper_bound).toFixed(0)})
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-accent-gold/20 hover:border-accent-gold/40 transition-colors group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Users className="w-6 h-6 text-accent-gold" />
                                        </div>
                                        <p className="text-[10px] text-accent-gold uppercase tracking-wider font-bold mb-1">Cartel Avg</p>
                                        <p className="text-2xl font-bold text-accent-gold">${Number(selectedItem.avg_price).toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-purple-500/20 hover:border-purple-500/40 transition-colors group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Package className="w-6 h-6 text-purple-400" />
                                        </div>
                                        <p className="text-[10px] text-purple-400 uppercase tracking-wider font-bold mb-1">Supply</p>
                                        <p className="text-2xl font-bold text-purple-400">{selectedItem.supply || '-'}</p>
                                    </div>
                                </div>

                                {/* Dense Details Table */}
                                <div className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-white/5">
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-gray-500 text-xs font-medium uppercase tracking-wide pl-4">Grade</td>
                                                <td className="p-3 text-white text-right font-bold pr-4">{selectedItem.grading_company} {selectedItem.grade}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-gray-500 text-xs font-medium uppercase tracking-wide pl-4">Cert ID</td>
                                                <td className="p-3 text-white text-right font-mono text-xs pr-4">{selectedItem.grading_id}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-gray-500 text-xs font-medium uppercase tracking-wide pl-4">Confidence</td>
                                                <td className="p-3 text-white text-right pr-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${Number(selectedItem.alt_value_confidence) > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {selectedItem.alt_value_confidence}%
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-gray-500 text-xs font-medium uppercase tracking-wide pl-4">Insured</td>
                                                <td className="p-3 text-white text-right font-mono pr-4">${selectedItem.insured_value}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-3 text-gray-500 text-xs font-medium uppercase tracking-wide pl-4">Listed</td>
                                                <td className="p-3 text-white text-right text-xs pr-4">{selectedItem.listed_at ? new Date(selectedItem.listed_at).toLocaleDateString() : '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop for Inspection Panel */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
                    onClick={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
