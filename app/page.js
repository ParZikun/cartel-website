'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import ListingGrid from './components/ListingGrid'
import { getSolPriceUsd } from './live/priceService'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import AdvancedFilters from '../components/AdvancedFilters'
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
  const [advancedFilters, setAdvancedFilters] = useState({
    priceRange: { min: '', max: '' },
    grades: [],
    categories: []
  })

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

  const handleClearFilters = useCallback(() => {
    setAdvancedFilters({
      priceRange: { min: '', max: '' },
      grades: [],
      categories: []
    });
    toast.success('Filters cleared');
  }, []);

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

        // Advanced filters - Price range
        const priceMatch =
          (advancedFilters.priceRange.min === '' || listing.price_amount >= advancedFilters.priceRange.min) &&
          (advancedFilters.priceRange.max === '' || listing.price_amount <= advancedFilters.priceRange.max);

        // Advanced filters - Grades
        const gradeMatch = advancedFilters.grades.length === 0 ||
          advancedFilters.grades.includes(listing.grade_num);

        // Advanced filters - Categories
        const advCategoryMatch = advancedFilters.categories.length === 0 ||
          advancedFilters.categories.includes(listing.cartel_category);

        return searchMatch && categoryMatch && priceMatch && gradeMatch && advCategoryMatch && listing.cartel_category !== 'SKIP';
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
  }, [listings, debouncedSearch, filter, sort, solPriceUSD, advancedFilters]);

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {/* Advanced Filters */}
          <AdvancedFilters
            filters={advancedFilters}
            onFilterChange={setAdvancedFilters}
            onClearFilters={handleClearFilters}
          />

          {/* Filter Dropdown */}
          <div className="relative min-w-[140px]">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Filter className="w-4 h-4 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full appearance-none bg-black/40 border border-white/10 rounded-lg pl-10 pr-8 py-2 text-sm text-white focus:outline-none focus:border-accent-gold/50 cursor-pointer"
            >
              <option value="all">All Deals</option>
              <option value="autobuy">Auto Buy</option>
              <option value="alert">Good Deals</option>
              <option value="info">Info</option>
            </select>
          </div>

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
              <option value="listed-time">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="difference-percent">Best Deals</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <ListingGrid listings={filteredAndSortedListings} loading={loading} error={error} solPriceUSD={solPriceUSD} />
    </div>
  )
}
