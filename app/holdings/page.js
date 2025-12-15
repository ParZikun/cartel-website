'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, ArrowUpDown, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import HoldingsCard from '../components/HoldingsCard';
import { toast } from 'sonner';

export default function HoldingsPage() {
    const { connected, publicKey } = useWallet();
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 20,
        total: 0,
        currentPage: 1,
        hasMore: true
    });

    const fetchHoldings = useCallback(async (offset = 0, page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const walletAddress = publicKey.toBase58();
            const response = await fetch(`/api/get-wallet-holdings?wallet=${walletAddress}&offset=${offset}&limit=${pagination.limit}`);

            if (response.status === 404) {
                setHoldings([]);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const rawHoldings = data.tokens || [];

            // Map API response
            const formattedHoldings = rawHoldings.map(item => ({
                // Images
                img_url: item.img || item.img_url || item.image,

                // Pricing & Alt Data
                alt_value: parseFloat(item.alt_value) || null,
                avg_price: parseFloat(item.cartel_avg) || parseFloat(item.avg_price) || null,
                price_amount: parseFloat(item.price_amount) || null,
                price_currency: item.price_currency || 'SOL',
                diff: parseFloat(item.diff) || 0,

                // Alt Details
                alt_asset_id: item.alt_asset_id,
                alt_value_lower_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[0]) : (parseFloat(item.alt_value_lower_bound) || null),
                alt_value_upper_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[1]) : (parseFloat(item.alt_value_upper_bound) || null),
                alt_value_confidence: parseFloat(item.alt_value_confidence) || null,

                // Listing Metadata
                name: item.name,
                category: item.category,
                cartel_category: item.cartel_category,
                is_listed: item.is_listed,
                last_analyzed_at: item.last_analyzed_at,

                // Grading
                grade: item.grade,
                grade_num: parseInt(item.grade_num) || null,
                grading_company: item.grading_company,
                grading_id: item.grading_id || item.cert_id || item.certification_number,

                // Supply & IDs
                supply: parseInt(item.supply) || null,
                token_mint: item.mint || item.token_mint,
                insured_value: parseFloat(item.insured_value) || null,
            }));

            setHoldings(formattedHoldings);
            setPagination(prev => ({
                ...prev,
                offset,
                currentPage: page,
                hasMore: rawHoldings.length === prev.limit
            }));
        } catch (e) {
            console.error("Failed to fetch holdings:", e);
            setError(e.message);
            toast.error('Failed to load holdings', {
                description: e.message
            });
        } finally {
            setLoading(false);
        }
    }, [pagination.limit]);

    useEffect(() => {
        fetchHoldings(0, 1);
    }, [fetchHoldings]);

    const handlePageChange = (newPage) => {
        const newOffset = (newPage - 1) * pagination.limit;
        fetchHoldings(newOffset, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full h-full p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                {/* Results Count */}
                <div className="text-sm text-gray-400">
                    Showing <span className="font-medium text-white">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to <span className="font-medium text-white">{(pagination.currentPage - 1) * pagination.limit + holdings.length}</span> results
                </div>

                {/* Pagination Controls (Top) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1 || loading}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-400 px-2">Page {pagination.currentPage}</span>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasMore || loading}
                        className="p-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading && holdings.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <Loader className="w-8 h-8 text-accent-gold animate-spin" />
                </div>
            ) : holdings.length === 0 && !error ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">No Holdings Found</h3>
                    <p className="text-gray-400 max-w-sm">
                        We couldn&apos;t find any Pokemon cards in your connected wallet.
                    </p>
                </div>
            ) : (
                <>
                    <div className="relative min-h-[500px]">
                        {/* Pagination Loading Buffer Overlay */}
                        {loading && holdings.length > 0 && (
                            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                                <div className="flex flex-col items-center gap-3 p-6 bg-[#0c0a15] border border-white/10 rounded-2xl shadow-2xl">
                                    <Loader className="w-8 h-8 text-accent-gold animate-spin" />
                                    <span className="text-sm font-medium text-white tracking-wide">Loading cards...</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {holdings.map((card, index) => (
                                <HoldingsCard key={card.token_mint || index} card={card} />
                            ))}
                        </div>
                    </div>

                    {/* Pagination Controls (Bottom) */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || loading}
                            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-400">
                            Page <span className="text-white font-medium">{pagination.currentPage}</span>
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasMore || loading}
                            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
