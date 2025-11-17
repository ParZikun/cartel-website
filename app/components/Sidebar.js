'use client'

import { X, Search } from 'lucide-react'

const FilterButton = ({ label, value, activeValue, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
      activeValue === value
        ? 'bg-accent-gold text-primary-bg font-semibold'
        : 'bg-white/10 text-primary-text/80 hover:bg-white/20'
    }`}
  >
    {label}
  </button>
)

const SortDropdown = ({ value, onChange, options }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-black/30 border border-gray-700 rounded-lg px-4 py-2.5 text-primary-text/90 focus:outline-none focus:ring-2 focus:ring-accent-gold"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default function Sidebar({
  filterValue,
  onFilterChange,
  sortValue,
  onSortChange,
  timeFilterValue,
  onTimeFilterChange,
  searchValue,
  onSearchChange,
  onClose,
}) {
  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Autobuy', value: 'autobuy' },
    { label: 'Alert', value: 'alert' },
    { label: 'Info', value: 'info' },
  ]

  const sortOptions = [
    { label: 'Listed Time', value: 'listed-time' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Difference %', value: 'difference-percent' },
    { label: 'Popularity', value: 'popularity' },
  ]

  const timeFilterOptions = [
    { label: 'Last Hour', value: '1h' },
    { label: 'Last 6 Hours', value: '6h' },
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'All Time', value: 'all' },
  ]

  return (
    <div className="h-full bg-primary-bg/90 backdrop-blur-lg border-r border-accent-gold/10 flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-pixel-lg text-accent-gold">Filters</h2>
        <button onClick={onClose} className="lg:hidden text-primary-text/70 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-text/50" size={20} />
        <input
          type="text"
          placeholder="Search by name, ID, pop..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-black/30 border border-gray-700 rounded-lg pl-12 pr-4 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-accent-gold"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-primary-text/90">Category</h3>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <FilterButton
              key={opt.value}
              label={opt.label}
              value={opt.value}
              activeValue={filterValue}
              onClick={onFilterChange}
            />
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-primary-text/90">Sort By</h3>
        <SortDropdown value={sortValue} onChange={onSortChange} options={sortOptions} />
      </div>

      {/* Added Time Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-primary-text/90">Added Time</h3>
        <SortDropdown value={timeFilterValue} onChange={onTimeFilterChange} options={timeFilterOptions} />
      </div>
    </div>
  )
}