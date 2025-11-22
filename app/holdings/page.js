'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Search, ArrowUpDown, Loader } from 'lucide-react';
import HoldingsCard from '../components/HoldingsCard';
import { toast } from 'sonner';

export default function HoldingsPage() {
    const { connected, publicKey } = useWallet();
    const [holdings, setHoldings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({ offset: 0, limit: 20, hasMore: true });

    const fetchHoldings = async (offset = 0) => {
        setLoading(true);
        setError(null);

        try {
            const walletAddress = "2yDeCKeFbjiwHhCvRohd2groXGaLVZNkrZLTTkiuTp2d"; // publicKey.toBase58()
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
                img_url: item.img || item.img_url || item.image,
                alt_value: parseFloat(item.alt_value) || null,
                avg_price: parseFloat(item.cartel_avg) || parseFloat(item.avg_price) || null,
                alt_value_lower_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[0]) : null,
                alt_value_upper_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[1]) : null,
                name: item.name,
                grade: item.grade,
                grade_num: parseInt(item.grade_num) || null,
                supply: parseInt(item.supply) || null,
                grading_id: item.grading_id || item.grading_number,
                token_mint: item.mint || item.token_mint,
            }));

            setHoldings(formattedHoldings);
            setPagination(prev => ({
                ...prev,
                offset,
                hasMore: rawHoldings.length === pagination.limit
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
    };

    useEffect(() => {
        fetchHoldings(pagination.offset);
    }, []);

    const filteredHoldings = holdings.filter(item => {
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = item.name?.toLowerCase().includes(searchLower);
        const gradingIdMatch = item.grading_id?.toString().toLowerCase().includes(searchLower);
        return nameMatch || gradingIdMatch;
    });

    return (
        <div className="w-full h-full p-6 space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search your holdings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                    />
                </div>

                {/* Results Count */}
                <div className="text-sm text-gray-400">
                    {filteredHoldings.length} card{filteredHoldings.length !== 1 ? 's' : ''} found
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
                        We couldn't find any Pokemon cards in your connected wallet.
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredHoldings.map((card, index) => (
                            <HoldingsCard key={card.token_mint || index} card={card} />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {pagination.hasMore && holdings.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => fetchHoldings(pagination.offset + pagination.limit)}
                                disabled={loading}
                                className="px-6 py-3 bg-accent-gold text-black font-bold rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_-5px_rgba(255,215,0,0.3)] flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
