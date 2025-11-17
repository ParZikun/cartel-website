'use client';

import { useState } from 'react';

export default function InspectPage() {
  const [mintAddress, setMintAddress] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleSearch = () => {
    // Placeholder for search logic
    if (mintAddress) {
      setSearchResult(`Details for ${mintAddress} would be shown here.`);
    } else {
      setSearchResult('Please enter a mint ID.');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Inspect a Card</h1>
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Token Mint Address"
            className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          {searchResult ? (
            <p>{searchResult}</p>
          ) : (
            <p>Enter a mint ID to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}