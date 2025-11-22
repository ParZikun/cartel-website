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

    useEffect(() => {
        const fetchHoldings = async () => {
            if (!connected || !publicKey) {
                setHoldings([])
                return
            }

            setLoading(true)
            setError(null)

            try {
                const walletAddress = publicKey.toBase58()
                const response = await fetch(`api/wallets/${walletAddress}/tokens`)

                if (response.status === 404) {
                    setHoldings([])
                    setLoading(false)
                    return
                }

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`API Error: ${response.status} - ${errorText}`)
                }

                const rawHoldings = await response.json()

                // Safely filter for Pokemon cards
                const pokemonHoldings = rawHoldings.filter(item => {
                    if (!item || !Array.isArray(item.attributes)) {
                        return false
                    }
                    return item.attributes.some(attr =>
                        typeof attr === 'object' && attr !== null &&
                        typeof attr.trait_type === 'string' && attr.trait_type === 'Category' &&
                        typeof attr.value === 'string' && attr.value === 'Pokemon'
                    )
                })

                setHoldings(pokemonHoldings)
            } catch (e) {
                console.error("Failed to fetch holdings:", e)
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        fetchHoldings()
    }, [connected, publicKey])

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

    if (!connected) {
        return (
            <div className="w-full h-full flex items-center justify-center p-6">
                <div className="glass p-12 rounded-2xl flex flex-col items-center text-center max-w-md w-full border border-accent-gold/20">
                    <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6 border border-accent-gold/30">
                        <Wallet className="w-10 h-10 text-accent-gold" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
                    <p className="text-gray-400 mb-8">Connect your Solana wallet to view your Pokemon card holdings.</p>
                    <WalletButton />
                </div>
            </div>
        )
    }

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
                <ListingGrid listings={filteredAndSortedHoldings} loading={loading} error={error} solPriceUSD={null} />
            )}
        </div>
    )
}
