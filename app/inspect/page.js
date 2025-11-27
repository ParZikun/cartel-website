'use client';

import { useState } from 'react';
import { Search, Loader, Tag, BarChart4, Users, Package, Copy, ExternalLink, Award, Shield, Hash, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { getConfidenceColor } from '../utils/format';

export default function InspectPage() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            toast.error('Please enter a Mint Address or Grading ID');
            return;
        }

        setLoading(true);
        setCard(null);
        setSearched(true);

        try {
            // First try to fetch all deals and filter client-side
            // Ideally, the backend should support a specific search endpoint
            const response = await fetch('/api/get-all-deals?limit=1000'); // Fetching a larger batch to search
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            const listings = data.data || [];

            const foundCard = listings.find(item =>
                item.token_mint === query.trim() ||
                item.grading_id === query.trim() ||
                item.certification_number === query.trim()
            );

            if (foundCard) {
                setCard(foundCard);
                toast.success('Card found!');
            } else {
                toast.error('Card not found in current database');
            }
        } catch (error) {
            console.error("Search failed:", error);
            toast.error('Search failed', { description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    return (
        <div className="w-full h-full p-6 space-y-8 max-w-7xl mx-auto flex flex-col items-center">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white font-pokemon-solid tracking-wide">Inspect Card</h1>
                <p className="text-gray-400">Enter a Token Mint or Grading ID to view full details.</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
                <div className="absolute inset-0 bg-accent-gold/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center bg-black/60 border border-white/10 rounded-2xl p-2 focus-within:border-accent-gold/50 focus-within:bg-black/80 transition-all shadow-2xl">
                    <Search className="w-6 h-6 text-gray-400 ml-4" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by Mint Address or Grading ID..."
                        className="w-full bg-transparent border-none text-white text-lg px-4 py-3 focus:outline-none placeholder:text-gray-600 font-mono"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-accent-gold text-black font-bold px-8 py-3 rounded-xl hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                </div>
            </form>

            {/* Results Area */}
            <div className="w-full max-w-6xl mt-12 transition-all duration-500">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader className="w-12 h-12 text-accent-gold animate-spin" />
                        <p className="text-gray-400 animate-pulse">Searching database...</p>
                    </div>
                ) : card ? (
                    <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            {/* Left: Image */}
                            <div className="lg:col-span-5 relative h-[500px] lg:h-auto bg-[#0c0a15] border-b lg:border-b-0 lg:border-r border-white/10 group">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10" />
                                <Image
                                    src={card.img_url || 'https://placehold.co/600x800/0c0a15/2d3748?text=No+Image'}
                                    alt={card.name}
                                    fill
                                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                                    priority
                                />
                                {/* Status Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg backdrop-blur-md border ${card.is_listed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                        {card.is_listed ? 'Listed' : 'Unlisted'}
                                    </span>
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="lg:col-span-7 p-8 lg:p-10 space-y-8 bg-black/20">
                                {/* Header */}
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <h2 className="text-3xl font-bold text-white leading-tight">{card.name}</h2>
                                        {card.cartel_category && (
                                            <span className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border whitespace-nowrap ${card.cartel_category === 'AUTOBUY' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                card.cartel_category === 'GOOD' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                                }`}>
                                                {card.cartel_category}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                                            <Hash className="w-4 h-4 text-gray-400" />
                                            <span className="font-mono text-sm text-gray-300">{card.grading_id || 'N/A'}</span>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(card.token_mint)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/copy"
                                        >
                                            <span className="font-mono text-sm text-accent-gold">{card.token_mint?.slice(0, 8)}...</span>
                                            <Copy className="w-3 h-3 text-gray-500 group-hover/copy:text-white transition-colors" />
                                        </button>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-[#0c0a15] border border-white/10 relative overflow-hidden group/box">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/box:opacity-20 transition-opacity">
                                            <Tag className="w-8 h-8 text-white" />
                                        </div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Price</p>
                                        <p className="text-3xl font-bold text-white">{card.price_amount ? `${Number(card.price_amount).toFixed(2)} SOL` : '-'}</p>
                                        <p className="text-sm text-gray-500 mt-1">≈ ${card.price_amount ? (card.price_amount * 150).toFixed(2) : '-'}</p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#0c0a15] border border-green-500/20 relative overflow-hidden group/box">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/box:opacity-20 transition-opacity">
                                            <BarChart4 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <p className="text-xs text-green-400 uppercase tracking-wider font-bold mb-1">Alt Value</p>
                                        <p className="text-3xl font-bold text-green-400">${card.alt_value ? Number(card.alt_value).toFixed(2) : '-'}</p>
                                        <p className="text-sm text-green-500/60 mt-1 font-mono">
                                            {card.alt_value_lower_bound ? `$${Number(card.alt_value_lower_bound).toFixed(0)} - $${Number(card.alt_value_upper_bound).toFixed(0)}` : ''}
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#0c0a15] border border-accent-gold/20 relative overflow-hidden group/box">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/box:opacity-20 transition-opacity">
                                            <Users className="w-8 h-8 text-accent-gold" />
                                        </div>
                                        <p className="text-xs text-accent-gold uppercase tracking-wider font-bold mb-1">Cartel Avg</p>
                                        <p className="text-3xl font-bold text-accent-gold">${card.avg_price ? Number(card.avg_price).toFixed(2) : '-'}</p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-[#0c0a15] border border-purple-500/20 relative overflow-hidden group/box">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover/box:opacity-20 transition-opacity">
                                            <Package className="w-8 h-8 text-purple-400" />
                                        </div>
                                        <p className="text-xs text-purple-400 uppercase tracking-wider font-bold mb-1">Supply</p>
                                        <p className="text-3xl font-bold text-purple-400">{card.supply || '-'}</p>
                                    </div>
                                </div>

                                {/* Detailed Info Table */}
                                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-white/5">
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-500 font-medium w-1/3">Grading Company</td>
                                                <td className="p-4 text-white font-bold text-right">{card.grading_company} {card.grade}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-500 font-medium">Confidence Score</td>
                                                <td className="p-4 text-right">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${Number(card.alt_value_confidence) > 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {card.alt_value_confidence}%
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-500 font-medium">Insured Value</td>
                                                <td className="p-4 text-white font-mono text-right">${card.insured_value || '-'}</td>
                                            </tr>
                                            <tr className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-gray-500 font-medium">Listed At</td>
                                                <td className="p-4 text-white text-right">{card.listed_at ? new Date(card.listed_at).toLocaleString() : '-'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* External Links */}
                                <div className="flex gap-4 pt-2">
                                    <a href={card.alt_asset_id ? `https://app.alt.xyz/research/${card.alt_asset_id}` : '#'} target="_blank" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/link">
                                        <Image src="https://cdn.prod.website-files.com/62829b28e6300b34ff739f02/629661dd02bdba04fb424173_ALT-white-logo.png" width={20} height={20} alt="ALT" className="opacity-70 group-hover/link:opacity-100 transition-opacity" />
                                        <span className="text-sm font-medium text-gray-300 group-hover/link:text-white">View on Alt</span>
                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover/link:text-white ml-1" />
                                    </a>
                                    <a href={`https://magiceden.io/item-details/${card.token_mint}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group/link">
                                        <Image src="https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/637db1043720a3ea88e4ea96_public.png" width={20} height={20} alt="ME" className="opacity-70 group-hover/link:opacity-100 transition-opacity" />
                                        <span className="text-sm font-medium text-gray-300 group-hover/link:text-white">Magic Eden</span>
                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover/link:text-white ml-1" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : searched ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Search className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Card Found</h3>
                        <p className="text-gray-400 max-w-md">
                            We couldn&apos;t find a card matching that Mint Address or Grading ID in our database.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <Search className="w-16 h-16 text-gray-700 mb-4" />
                        <p className="text-gray-500">Search results will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
