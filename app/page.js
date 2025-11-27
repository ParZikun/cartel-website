'use client'

import { useState, useEffect, useMemo } from 'react'
import ListingGrid from './components/ListingGrid'
import { getSolPriceUsd } from './live/priceService'
import { Search, ArrowUpDown, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('listed-time')
  const [solPriceUSD, setSolPriceUSD] = useState(null)

  useEffect(() => {
    const fetchPrice = async () => {
      const price = await getSolPriceUsd();
      if (price > 0) {
        setSolPriceUSD(price);
      }
    };
    fetchPrice();
    const priceInterval = setInterval(fetchPrice, 60000);
    return () => clearInterval(priceInterval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/get-listings');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setListings(data);
      } catch (e) {
        setError(e.message);
        toast.error('Failed to load listings', {
          description: e.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredAndSortedListings = useMemo(() => {
    return listings
      .map(listing => {
        const listingPriceUSD = listing.price_amount ? listing.price_amount * solPriceUSD : null;
        const diffPercent = (listingPriceUSD && listing.alt_value > 0) ? (((listingPriceUSD - listing.alt_value) / listing.alt_value) * 100) : null;
        return { ...listing, diffPercent };
      })
      .filter(listing => {
        // Search filter (using debounced search)
        const searchLower = debouncedSearch.toLowerCase();
        const nameMatch = listing.name?.toLowerCase().includes(searchLower);
        const gradingIdMatch = listing.grading_id?.toString().toLowerCase().includes(searchLower);
        const popMatch = listing.supply?.toString().toLowerCase().includes(searchLower);
        const searchMatch = nameMatch || gradingIdMatch || popMatch;

        // Category filter (old filter dropdown)
        const categoryMap = {
          autobuy: 'AUTOBUY',
          alert: 'GOOD',
          info: 'OK'
        };
        const categoryMatch = filter === 'all' || listing.cartel_category === categoryMap[filter];

        return searchMatch && categoryMatch && listing.cartel_category !== 'SKIP';
      })
      .sort((a, b) => {
        switch (sort) {
          case 'price-low':
            return (a.price_amount || 0) - (b.price_amount || 0);
          case 'price-high':
            return (b.price_amount || 0) - (a.price_amount || 0);
          case 'difference-percent':
            return (a.diffPercent || 0) - (b.diffPercent || 0);
          case 'popularity':
            return (a.supply || 0) - (b.supply || 0);
          case 'listed-time':
          default:
            return new Date(b.listed_at) - new Date(a.listed_at);
        }
      });
  }, [listings, debouncedSearch, filter, sort, solPriceUSD]);

  const handleCartelRecheck = async () => {
    toast.info('Refreshing Cartel Deals...');
    try {
      const response = await fetch('/api/get-listings');
      if (!response.ok) throw new Error('Failed to refresh');
      const data = await response.json();
      setListings(data);
      toast.success('Cartel Deals updated');
    } catch (e) {
      toast.error('Failed to refresh deals');
    }
  };

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        {/* Search */}
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto">

          {/* Category Segmented Control */}
          <div className="bg-black/40 border border-white/10 rounded-lg p-1 flex items-center w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All', color: 'text-gray-400 hover:text-white' },
              { id: 'autobuy', label: 'Gold', color: 'text-yellow-500' },
              { id: 'alert', label: 'Red', color: 'text-red-500' },
              { id: 'info', label: 'Blue', color: 'text-sky-500' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`
                  flex-1 sm:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${filter === cat.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : `${cat.color} hover:bg-white/5`
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-[180px] flex-shrink-0">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="w-4 h-4 text-gray-400" />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none bg-black border border-yellow-500 rounded-lg pl-10 pr-8 py-2 text-sm text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 cursor-pointer"
            >
              <option value="listed-time">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="difference-percent">Best Deals</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>

          {/* Cartel Recheck Button */}
          <div className="relative group">
            <button
              onClick={handleCartelRecheck}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/20 hover:bg-accent-gold/20 transition-colors font-medium whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Cartel Recheck</span>
              <div className="w-4 h-4 rounded-full border border-accent-gold/50 flex items-center justify-center text-[10px] font-bold">i</div>
            </button>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-black/90 border border-white/10 rounded-lg text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
              Refreshes listings currently in Cartel Deals.
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <ListingGrid listings={filteredAndSortedListings} loading={loading} error={error} solPriceUSD={solPriceUSD} />
    </div>
  )
}
