'use client';

import React from 'react';

export default function InspectPage() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">Inspect a Card</h1>
      <div className="max-w-2xl mx-auto bg-gray-900 p-6 rounded-lg border border-yellow-500/30">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter Token Mint Address..."
            className="flex-grow bg-gray-800 border border-gray-700 rounded-md py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-md hover:bg-yellow-400 transition-colors duration-300">
            Search
          </button>
        </div>
        <div className="mt-8 p-10 text-center bg-gray-800/50 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">Enter a mint ID to see details</p>
        </div>
      </div>
    </div>
  );
}
