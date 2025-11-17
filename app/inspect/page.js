"use client";

import React, { useState } from 'react';

const InspectPage = () => {
  const [mintAddress, setMintAddress] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!mintAddress) return;
    // Placeholder for search logic
    console.log(`Searching for mint address: ${mintAddress}`);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-8">Inspect a Card</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Token Mint Address"
            className="bg-gray-800 border border-gray-600 rounded-lg p-4 w-full flex-grow focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 disabled:bg-gray-500"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 min-h-[200px] flex items-center justify-center">
          {cardDetails ? (
            <div>
              {/* Placeholder for card details display */}
              <pre>{JSON.stringify(cardDetails, null, 2)}</pre>
            </div>
          ) : (
            <p className="text-gray-400">Enter a mint ID to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectPage;
