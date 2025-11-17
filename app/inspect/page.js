'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function InspectPage() {
  const [mintAddress, setMintAddress] = useState('')

  const handleSearch = () => {
    console.log('Searching for mint address:', mintAddress)
    // Placeholder for search functionality
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header apiStatus={'live'} lastUpdated={new Date()} />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass rounded-xl shadow-lg p-8">
            <h1 className="text-2xl md:text-3xl font-pixel-lg text-accent-gold mb-6 text-center">
              Inspect a Card
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Enter Mint Address..."
                className="flex-grow w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                className="btn-primary w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-lg"
              >
                Search
              </button>
            </div>

            <div className="mt-8 p-6 border-2 border-dashed border-gray-700 rounded-lg min-h-[10rem] flex items-center justify-center">
              <p className="text-gray-500 font-mono text-center">
                Inspection results will appear here...
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}