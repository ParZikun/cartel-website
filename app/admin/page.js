'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ListingsTab from '../components/admin/ListingsTab'
import ActionsTab from '../components/admin/ActionsTab'
import { Toaster } from 'react-hot-toast'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('listings')

  return (
    <div className="min-h-screen flex flex-col">
      <Header apiStatus={'live'} lastUpdated={new Date()} />
      <Toaster />
      
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-pixel-lg text-accent-gold mb-8">Admin Panel</h1>
          
          <div className="border-b border-gray-700 mb-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('listings')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'listings'
                    ? 'border-accent-gold text-accent-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'actions'
                    ? 'border-accent-gold text-accent-gold'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                Actions
              </button>
            </nav>
          </div>

          <div>
            {activeTab === 'listings' && <ListingsTab />}
            {activeTab === 'actions' && <ActionsTab />}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}