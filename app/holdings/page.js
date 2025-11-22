'use client'

import { useState, useEffect, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Wallet, Search, Filter, ArrowUpDown, Loader } from 'lucide-react'
import ListingGrid from '../components/ListingGrid'
import WalletButton from '../components/WalletButton'

export default function HoldingsPage() {
    const { connected, publicKey } = useWallet()
    const [holdings, setHoldings] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState('all')
    const [sort, setSort] = useState('listed-time')
    const [pagination, setPagination] = useState({ offset: 0, limit: 20, hasMore: true })

    const fetchHoldings = async (offset = 0) => {
        // Temporarily disabled for testing with hardcoded wallet
        // if (!connected || !publicKey) {
        //     setHoldings([])
        //     return
        // }

        setLoading(true)
        setError(null)

        try {
            const walletAddress = "2yDeCKeFbjiwHhCvRohd2groXGaLVZNkrZLTTkiuTp2d" //publicKey.toBase58()
            const response = await fetch(`/api/get-wallet-holdings?wallet=${walletAddress}&offset=${offset}&limit=${pagination.limit}`)

            if (response.status === 404) {
                setHoldings([])
                setLoading(false)
                return
            }

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`API Error: ${response.status} - ${errorText}`)
            }

            const data = await response.json()
            const rawHoldings = data.tokens || []

            // Map API response to ListingGrid format
            const formattedHoldings = rawHoldings.map(item => ({
                // Image mapping - API returns 'img' not 'image'
                img_url: item.img || item.img_url || item.image,

                // Price and value mappings
                price_amount: parseFloat(item.cartel_avg) || 0,
                alt_value: parseFloat(item.alt_value) || null,
                avg_price: parseFloat(item.cartel_avg) || parseFloat(item.avg_price) || null,

                // Alt range - parse from string "min - max"
                alt_value_lower_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[0]) : null,
                alt_value_upper_bound: item.alt_range ? parseFloat(item.alt_range.split(' - ')[1]) : null,

                // Other fields
                name: item.name,
                grade: item.grade,
                supply: parseInt(item.supply) || null,
                grading_id: item.grading_id || item.grading_number,
                token_mint: item.mint || item.token_mint,
                insured_value: parseFloat(item.insured_value) || null,
                cartel_category: item.cartel_category,
                listed_at: item.listed_at,
                alt_asset_id: item.alt_asset_id,
                alt_link: item.alt_link,
                listed: false, // Holdings are not listed for sale
            }))

            setHoldings(formattedHoldings)
            setPagination(prev => ({
                ...prev,
                offset,
                hasMore: rawHoldings.length === pagination.limit
            }))
        } catch (e) {
            console.error("Failed to fetch holdings:", e)
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHoldings(pagination.offset)
    }, []) // Removed connected/publicKey dependencies for testing

    const filteredAndSortedHoldings = useMemo(() => {
        return holdings
            .filter(item => {
                // Search filter
                const searchLower = searchQuery.toLowerCase()
                const nameMatch = item.name?.toLowerCase().includes(searchLower)
                const gradingIdMatch = item.grading_id?.toString().toLowerCase().includes(searchLower)
                const searchMatch = nameMatch || gradingIdMatch

                // Category filter (mapping might need adjustment based on actual data structure for holdings)
                // Assuming holdings have similar structure or we just filter by what we have
                // For now, basic filtering if attributes exist

                return searchMatch
            })
            .sort((a, b) => {
                // Basic sorting
                return 0 // Placeholder for now as holdings might not have all listing fields
            })
    }, [holdings, searchQuery, filter, sort])

    // Temporarily disabled wallet check for testing
    // if (!connected) {
    //     return (
    //         <div className="w-full h-full flex items-center justify-center p-6">
    //             <div className="glass p-12 rounded-2xl flex flex-col items-center text-center max-w-md w-full border border-accent-gold/20">
    //                 <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6 border border-accent-gold/30">
    //                     <Wallet className="w-10 h-10 text-accent-gold" />
    //                 </div>
    //                 <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
    //                 <p className="text-gray-400 mb-8">Connect your Solana wallet to view your Pokemon card holdings.</p>
    //                 <WalletButton />
    //             </div>
    //         </div>
    //     )
    // }

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

                {/* Filters & Sort */}
                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {/* Sort Dropdown */}
                    <div className="relative min-w-[160px]">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-accent-gold/50 cursor-pointer"
                        >
                            <option value="listed-time">Newest Acquired</option>
                            <option value="name">Name</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid */}
            {holdings.length === 0 && !loading && !error ? (
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
                    <ListingGrid listings={filteredAndSortedHoldings} loading={loading} error={error} solPriceUSD={null} />

                    {/* Load More Button */}
                    {pagination.hasMore && holdings.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => fetchHoldings(pagination.offset + pagination.limit)}
                                disabled={loading}
                                className="px-6 py-3 bg-accent-gold text-black font-bold rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_-5px_rgba(255,215,0,0.3)]"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
