'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function InspectPage() {
  const [mintAddress, setMintAddress] = useState('')

  const handleSearch = () => {
    if (mintAddress) {
      console.log(`Searching for mint address: ${mintAddress}`)
      // Placeholder for search functionality
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header apiStatus="live" lastUpdated={new Date()} />
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-accent-gold font-pixel-lg text-2xl md:text-3xl text-center mb-6">
              Inspect a Card
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="text"
                value={mintAddress}
                onChange={(e) => setMintAddress(e.target.value)}
                placeholder="Enter Mint Address..."
                className="w-full flex-grow bg-black/40 border border-gray-700 rounded-md px-4 py-2 text-white font-mono focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                className="btn-primary w-full sm:w-auto px-6 py-2 rounded-md text-lg"
              >
                Search
              </button>
            </div>

            <div className="mt-8 p-6 border-2 border-dashed border-gray-700 rounded-lg min-h-[200px] flex items-center justify-center">
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
