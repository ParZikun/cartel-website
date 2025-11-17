'use client'

import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import ListingGrid from './components/ListingGrid'
import { getSolPriceUsd } from './live/priceService'

export default function Home() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('listed-time')
  const [timeFilter, setTimeFilter] = useState('all')
  const [solPriceUSD, setSolPriceUSD] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [apiStatus, setApiStatus] = useState('loading')

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      setApiStatus('loading');
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
        setApiStatus('error');
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
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const nameMatch = listing.name?.toLowerCase().includes(searchLower);
        const gradingIdMatch = listing.grading_id?.toString().toLowerCase().includes(searchLower);
        const popMatch = listing.supply?.toString().toLowerCase().includes(searchLower);
        const searchMatch = nameMatch || gradingIdMatch || popMatch;

        // Category filter
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
  }, [listings, searchQuery, filter, sort, timeFilter, solPriceUSD]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        apiStatus={apiStatus} 
        lastUpdated={lastUpdated} 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5">
        <aside className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={() => setIsSidebarOpen(false)}></aside>
        <aside className={`fixed top-0 left-0 h-full w-72 z-40 transform transition-transform duration-300 ease-in-out bg-primary-bg lg:static lg:col-span-1 xl:col-span-1 lg:w-auto lg:transform-none lg:transition-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar 
            filterValue={filter} 
            onFilterChange={setFilter} 
            sortValue={sort} 
            onSortChange={setSort}
            timeFilterValue={timeFilter}
            onTimeFilterChange={setTimeFilter}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
        
        <main className="lg:col-span-3 xl:col-span-4 px-4 sm:px-6 lg:px-8 py-8">
          <ListingGrid listings={filteredAndSortedListings} loading={loading} error={error} solPriceUSD={solPriceUSD} />
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
