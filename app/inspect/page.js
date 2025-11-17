'use client';

import { useState } from 'react';

export default function InspectPage() {
  const [mintAddress, setMintAddress] = useState('');

  const handleSearch = () => {
    console.log('Searching...');
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <div className="glass rounded-xl shadow-lg p-8">
          <h1 className="text-3xl text-accent-gold font-pixel-lg mb-6 text-center">
            Inspect a Card
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="Enter Mint Address..."
              className="flex-grow w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all"
            />
            <button
              onClick={handleSearch}
              className="btn-primary w-full sm:w-auto px-6 py-3 rounded-lg font-bold"
            >
              Search
            </button>
          </div>

          <div className="mt-8 p-6 border-2 border-dashed border-gray-700 rounded-lg min-h-[10rem] flex items-center justify-center">
            <p className="text-gray-500 font-mono">
              Inspection results will appear here...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
