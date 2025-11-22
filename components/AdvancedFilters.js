'use client'

import { useState } from 'react'
import { Sliders, X, DollarSign, Award, Tag } from 'lucide-react'

export default function AdvancedFilters({ filters, onFilterChange, onClearFilters }) {
    const [isOpen, setIsOpen] = useState(false)

    const handlePriceChange = (type, value) => {
        onFilterChange({
            ...filters,
            priceRange: {
                ...filters.priceRange,
                [type]: value === '' ? '' : parseFloat(value)
            }
        })
    }

    const handleGradeChange = (grade) => {
        const newGrades = filters.grades.includes(grade)
            ? filters.grades.filter(g => g !== grade)
            : [...filters.grades, grade]
        onFilterChange({ ...filters, grades: newGrades })
    }

    const handleCategoryChange = (category) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category]
        onFilterChange({ ...filters, categories: newCategories })
    }

    const activeFilterCount =
        (filters.priceRange.min !== '' || filters.priceRange.max !== '' ? 1 : 0) +
        filters.grades.length +
        filters.categories.length

    const grades = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
    const categories = ['AUTOBUY', 'GOOD', 'SKIP']

    return (
        <>
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors font-medium"
            >
                <Sliders className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-gold text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Filter Sidebar */}
                    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-gradient-to-br from-[#0c0a15] via-[#1a1625] to-[#0c0a15] border-l-2 border-accent-gold/30 shadow-2xl z-50 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent-gold/20 border-2 border-accent-gold flex items-center justify-center">
                                        <Sliders className="w-5 h-5 text-accent-gold" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Advanced Filters</h2>
                                        {activeFilterCount > 0 && (
                                            <p className="text-xs text-gray-400">{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-accent-gold font-bold uppercase text-sm tracking-wider">
                                    <DollarSign className="w-4 h-4" />
                                    <span>Price Range (SOL)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase mb-1 block">Min</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="0.00"
                                            value={filters.priceRange.min}
                                            onChange={(e) => handlePriceChange('min', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase mb-1 block">Max</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="∞"
                                            value={filters.priceRange.max}
                                            onChange={(e) => handlePriceChange('max', e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-accent-gold/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Grade Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-accent-gold font-bold uppercase text-sm tracking-wider">
                                    <Award className="w-4 h-4" />
                                    <span>Grade</span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {grades.map(grade => (
                                        <button
                                            key={grade}
                                            onClick={() => handleGradeChange(grade)}
                                            className={`
                                                px-3 py-2 rounded-lg font-bold text-sm transition-all
                                                ${filters.grades.includes(grade)
                                                    ? 'bg-accent-gold text-black shadow-[0_0_15px_-5px_rgba(255,215,0,0.5)]'
                                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}
                                            `}
                                        >
                                            {grade}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-accent-gold font-bold uppercase text-sm tracking-wider">
                                    <Tag className="w-4 h-4" />
                                    <span>Cartel Category</span>
                                </div>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <label
                                            key={category}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.categories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                                className="w-4 h-4 rounded border-white/20 bg-black/40 text-accent-gold focus:ring-accent-gold focus:ring-offset-0"
                                            />
                                            <span className={`
                                                px-2.5 py-0.5 rounded-full text-xs font-bold border
                                                ${category === 'AUTOBUY'
                                                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                                                    : category === 'GOOD'
                                                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                                        : 'bg-purple-500/20 text-purple-400 border-purple-500/40'}
                                            `}>
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={onClearFilters}
                                    className="flex-1 py-3 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 py-3 rounded-lg bg-gradient-to-r from-accent-gold to-yellow-600 text-black font-bold hover:from-accent-gold/90 hover:to-yellow-600/90 transition-all shadow-[0_0_20px_-5px_rgba(255,215,0,0.5)]"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
