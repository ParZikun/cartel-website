'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [timeFilter, setTimeFilter] = useState('all')
  const [solPriceUSD, setSolPriceUSD] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [apiStatus, setApiStatus] = useState('loading')

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
        setApiStatus('live');
        setLastUpdated(new Date());
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

  const filteredAndSortedListings = useMemo(() => {
    const now = new Date();
    const timeFilteredListings = listings.filter(listing => {
      if (timeFilter === 'all') return true;
      const listedAt = new Date(listing.listed_at);
      const diffHours = (now - listedAt) / (1000 * 60 * 60);
      if (timeFilter === '1h') return diffHours <= 1;
      if (timeFilter === '6h') return diffHours <= 6;
      if (timeFilter === '24h') return diffHours <= 24;
      return true;
    });

    return timeFilteredListings
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
  }, [listings, searchQuery, filter, sort, timeFilter, solPriceUSD]);

  return (
    <div className="w-full h-full">
      {/* Header/Controls Bar */}
      <div className="p-4 bg-primary-bg border-b border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 bg-gray-800 border border-gray-700 rounded-md py-2 px-4 mb-2 md:mb-0"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4">
                <option value="all">All Categories</option>
                <option value="autobuy">Autobuy</option>
                <option value="alert">Alert</option>
                <option value="info">Info</option>
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4">
                <option value="listed-time">Newest</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="difference-percent">Difference %</option>
                <option value="popularity">Popularity</option>
              </select>
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-md py-2 px-4 col-span-2 md:col-span-1">
                <option value="all">All Time</option>
                <option value="1h">Last 1h</option>
                <option value="6h">Last 6h</option>
                <option value="24h">Last 24h</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-4 mt-2 md:mt-0 text-sm">
              <div className="flex items-center space-x-2">
                <span className={`h-3 w-3 rounded-full ${apiStatus === 'live' ? 'bg-green-500' : apiStatus === 'loading' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                <span>{apiStatus}</span>
              </div>
              {lastUpdated && <span>Updated: {lastUpdated.toLocaleTimeString()}</span>}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
        <ListingGrid listings={filteredAndSortedListings} loading={loading} error={error} solPriceUSD={solPriceUSD} />
      </main>
    </div>
  )
}
