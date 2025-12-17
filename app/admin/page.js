'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, ChevronLeft, ChevronRight, X, Eye, CheckCircle, AlertCircle, Clock, Copy, BarChart4, Tag, Users, Package, Filter, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getConfidenceColor } from '../utils/format';

export default function AdminPage() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, total_pages: 0 });

    // Filters & Sort State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        category: '',
        grading_company: '',
        is_listed: 'true' // default to 'true' string for select value
    });
    const [sort, setSort] = useState({ field: 'listed_at', order: 'desc' });

    // Inspection & Overlay State
    const [selectedItem, setSelectedItem] = useState(null);
    const [overlayLoading, setOverlayLoading] = useState(false);
    const [salesHistory, setSalesHistory] = useState(null);
    const [showHistoryOverlay, setShowHistoryOverlay] = useState(false);

    const fetchData = async (page = 1) => {
        setLoading(true);
        try {
            // Build Query Params
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                sort_by: sort.field,
                order: sort.order,
            });

            if (searchQuery) params.append('search', searchQuery);
            if (filters.category) params.append('category', filters.category);
            if (filters.grading_company) params.append('grading_company', filters.grading_company);
            if (filters.is_listed !== 'all') params.append('is_listed', filters.is_listed);

            const response = await fetch(`/api/get-all-deals?${params.toString()}`);
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

    // Refetch when dependencies change
    useEffect(() => {
        fetchData(pagination.page);
    }, [pagination.page, sort]);
    // Note: We don't auto-fetch on filter change to avoid spam, user might want "Apply" or debounce. 
    // But for this UX, adding a debounce or "Enter" check for search is good.
    // For dropdowns, instant fetch is usually fine. Let's add them to dependency array for instant feel.
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 on filter change
        fetchData(1);
    }, [filters, searchQuery]);


    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const fetchHistory = async (e, item) => {
        e.stopPropagation(); // Prevent opening sidebar if inside table
        if (!item?.token_mint) return;

        setOverlayLoading(true);
        setSalesHistory(null);
        setShowHistoryOverlay(true);

        try {
            const res = await fetch(`/api/listing-details/${item.token_mint}`);
            if (!res.ok) throw new Error("Failed to fetch history");
            const data = await res.json();
            setSalesHistory(data);

            // If item is currently selected in sidebar, update it too
            if (selectedItem?.token_mint === item.token_mint) {
                setSelectedItem(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            toast.error("Could not load sales history");
            setShowHistoryOverlay(false); // Close if error
        } finally {
            setOverlayLoading(false);
        }
    };

    const copyToClipboard = (e, text) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="w-full h-full p-6 space-y-6 relative">
            {/* Top Action Bar */}
            <div className="flex flex-col gap-4 bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Deal Management</h1>
                        <p className="text-gray-400 text-sm">Monitor and manage active listings.</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center pt-2 border-t border-white/5">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/20"
                        />
                    </div>

                    <select
                        value={filters.grading_company}
                        onChange={(e) => setFilters(prev => ({ ...prev, grading_company: e.target.value }))}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none"
                    >
                        <option value="">All Companies</option>
                        <option value="PSA">PSA</option>
                        <option value="BGS">BGS</option>
                        <option value="CGC">CGC</option>
                    </select>

                    <select
                        value={filters.category}
                        onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        <option value="AUTOBUY">Autobuy</option>
                        <option value="GOOD">Good</option>
                        <option value="OK">OK</option>
                        <option value="SKIP">Skip</option>
                        <option value="NEW">New</option>
                    </select>

                    <select
                        value={filters.is_listed}
                        onChange={(e) => setFilters(prev => ({ ...prev, is_listed: e.target.value }))}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none"
                    >
                        <option value="all">Status: All</option>
                        <option value="true">Active Only</option>
                        <option value="false">Unlisted Only</option>
                    </select>

                    <button
                        onClick={() => { setFilters({ category: '', grading_company: '', is_listed: 'true' }); setSearchQuery(''); }}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Reset Filters"
                    >
                        <X className="w-4 h-4" />
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
                                <th
                                    className="p-4 font-medium cursor-pointer hover:text-white transition-colors group"
                                    onClick={() => handleSort('diff')}
                                >
                                    <div className="flex items-center gap-1">
                                        Alt Value
                                        <ArrowUpDown className={`w-3 h-3 ${sort.field === 'diff' ? 'text-accent-gold' : 'opacity-30'}`} />
                                    </div>
                                </th>
                                <th
                                    className="p-4 font-medium cursor-pointer hover:text-white transition-colors group"
                                    onClick={() => handleSort('price')}
                                >
                                    <div className="flex items-center gap-1">
                                        Price
                                        <ArrowUpDown className={`w-3 h-3 ${sort.field === 'price' ? 'text-accent-gold' : 'opacity-30'}`} />
                                    </div>
                                </th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium hidden md:table-cell">Cartel Tier</th>
                                <th
                                    className="p-4 font-medium hidden lg:table-cell cursor-pointer hover:text-white transition-colors"
                                    onClick={() => handleSort('listed_at')}
                                >
                                    <div className="flex items-center gap-1">
                                        Last Scan
                                        <ArrowUpDown className={`w-3 h-3 ${sort.field === 'listed_at' ? 'text-accent-gold' : 'opacity-30'}`} />
                                    </div>
                                </th>
                                <th className="p-4 font-medium text-right hidden sm:table-cell">Actions</th>
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
                                    <td className="p-4 max-w-[200px]">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white line-clamp-2 text-sm">{item.name || 'Unknown Item'}</span>
                                            <button
                                                onClick={(e) => copyToClipboard(e, item.token_mint)}
                                                className="font-mono text-[10px] text-gray-500 hover:text-accent-gold transition-colors text-left flex items-center gap-1 mt-1"
                                            >
                                                {item.token_mint ? `${item.token_mint.substring(0, 6)}...` : 'No Mint'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <div className="flex flex-col">
                                            <span className={`font-mono font-bold ${getConfidenceColor(item.alt_value_confidence).text}`}>
                                                ${item.alt_value != null ? Number(item.alt_value).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '-'}
                                            </span>
                                            <span className={`text-[10px] ${getConfidenceColor(item.alt_value_confidence).text} opacity-70`}>
                                                {item.alt_value_confidence}% Conf.
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-accent-gold font-bold">{item.price_amount != null ? Number(item.price_amount).toFixed(2) : '0.00'} SOL</span>
                                            <span className="text-[10px] text-gray-500">
                                                {item.price_usd ? `$${Number(item.price_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Converting...'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`
                                            inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border whitespace-nowrap
                                            ${item.is_listed
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}
                                        `}>
                                            {item.is_listed ? 'Listed' : 'Unlisted'}
                                        </span>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
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
                                    <td className="p-4 hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                                            <span className="font-mono text-xs">{item.last_analyzed_at ? new Date(item.last_analyzed_at).toLocaleString() : '-'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right hidden sm:table-cell">
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
                        Showing <span className="font-medium text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium text-white">{pagination.total}</span>
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

                                {/* Meta Info Section */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 shadow-inner max-w-full overflow-hidden">
                                            <span className="text-sm font-mono text-accent-gold tracking-wider truncate">
                                                {selectedItem.token_mint}
                                            </span>
                                            <button
                                                onClick={(e) => copyToClipboard(e, selectedItem.token_mint)}
                                                className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${selectedItem.is_listed ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                {selectedItem.is_listed ? 'Listed' : 'Unlisted'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-white/10">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Price</p>
                                        <p className="text-2xl font-bold text-white">{Number(selectedItem.price_amount).toFixed(2)} SOL</p>
                                        <p className="text-xs text-gray-500 font-mono mt-1">
                                            {selectedItem.price_usd ? `≈ $${Number(selectedItem.price_usd).toLocaleString()}` : '$0.00'}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-green-500/20">
                                        <p className="text-[10px] text-green-400 uppercase font-bold mb-1">Alt Value</p>
                                        <p className="text-2xl font-bold text-green-400">${Number(selectedItem.alt_value).toLocaleString()}</p>
                                    </div>

                                    {/* CARTEL AVG - CLICKABLE */}
                                    <div
                                        className="p-4 rounded-xl bg-[#0c0a15] border border-accent-gold/20 hover:border-accent-gold/50 cursor-pointer transition-colors relative group"
                                        onClick={(e) => fetchHistory(e, selectedItem)}
                                    >
                                        <div className="absolute top-2 right-2 opacity-50"><RefreshCw className="w-3 h-3 text-accent-gold" /></div>
                                        <p className="text-[10px] text-accent-gold uppercase font-bold mb-1">Cartel Avg</p>
                                        <p className="text-2xl font-bold text-accent-gold">
                                            ${selectedItem.avg_price ? Number(selectedItem.avg_price).toLocaleString() : '0.00'}
                                        </p>
                                        <p className="text-[10px] text-accent-gold/60 mt-1">Click to Load History</p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#0c0a15] border border-purple-500/20">
                                        <p className="text-[10px] text-purple-400 uppercase font-bold mb-1">Supply</p>
                                        <p className="text-2xl font-bold text-purple-400">{selectedItem.supply || '-'}</p>
                                    </div>
                                </div>

                                {/* Deep Dive Details (Restored) */}
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Deep Dive</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase">Confidence</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${getConfidenceColor(selectedItem.alt_value_confidence).bg}`} />
                                                <p className="text-sm font-bold text-white">{selectedItem.alt_value_confidence}%</p>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase">Valuation Range</p>
                                            <p className="text-sm font-bold text-white mt-1">
                                                ${selectedItem.alt_value_min?.toLocaleString()} - ${selectedItem.alt_value_max?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase">Cert Number</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <p className="text-sm font-mono text-gray-300 truncate tracking-wider">{selectedItem.grading_id}</p>
                                                <Copy className="w-3 h-3 text-gray-600 cursor-pointer hover:text-white" onClick={(e) => copyToClipboard(e, selectedItem.grading_id)} />
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase">Last Analyzed</p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3 text-gray-500" />
                                                <p className="text-sm text-gray-300">{selectedItem.last_analyzed_at ? new Date(selectedItem.last_analyzed_at).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                )}
                    </div>

            {/* Sales History Overlay */}
                {showHistoryOverlay && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-[#12101a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="font-bold text-white">Recent Sales History</h3>
                                <button onClick={() => setShowHistoryOverlay(false)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                                {overlayLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                        <p>Fetching Transactions...</p>
                                    </div>
                                ) : salesHistory?.transactions?.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                                <p className="text-xs text-gray-500 uppercase">New Avg</p>
                                                <p className="text-xl font-bold text-white">${salesHistory.avg_price ? Math.round(salesHistory.avg_price).toLocaleString() : '-'}</p>
                                            </div>
                                            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">
                                                <p className="text-xs text-gray-500 uppercase">Sales Found</p>
                                                <p className="text-xl font-bold text-white">{salesHistory.transactions.length}</p>
                                            </div>
                                        </div>
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="text-gray-500 text-xs uppercase border-b border-white/5">
                                                    <th className="pb-2">Date</th>
                                                    <th className="pb-2 text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {salesHistory.transactions.slice(0, 15).map((tx, i) => (
                                                    <tr key={i} className="text-gray-300">
                                                        <td className="py-2">{new Date(tx.date).toLocaleDateString()}</td>
                                                        <td className="py-2 text-right font-mono">${Math.round(tx.price).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No sales history found for this item.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

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
