'use client';

import { useState } from 'react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('Status');

  const renderContent = () => {
    switch (activeTab) {
      case 'Listings':
        return <div className="text-gray-400">Table of all listings goes here.</div>;
      case 'Status':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-yellow-400">App Status</h3>
                <p className="text-2xl text-green-400">Running</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-yellow-400">Last Scan</h3>
                <p className="text-2xl text-gray-300">3 minutes ago</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold text-yellow-400">Deal Count</h3>
                <p className="text-2xl text-gray-300">1,284</p>
              </div>
            </div>
            <div className="bg-black p-4 rounded-lg shadow-lg h-64 overflow-y-auto">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Log Viewer</h3>
              <pre className="text-green-400 text-sm font-mono">
                <p>[INFO] 2023-10-27 10:00:00 - Application started successfully.</p>
                <p>[INFO] 2023-10-27 10:00:05 - Scanning for new listings...</p>
                <p>[DEBUG] 2023-10-27 10:00:10 - Found 5 new listings.</p>
                <p>[WARN] 2023-10-27 10:00:15 - Listing XYZ has a suspicious price.</p>
                <p>[INFO] 2023-10-27 10:00:20 - Scan complete. Found 2 deals.</p>
              </pre>
            </div>
          </div>
        );
      case 'Actions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Maintenance Actions</h3>
              <button className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">
                Re-check Skipped Listings
              </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold text-yellow-400 mb-4">Database Management</h3>
              <button className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300">
                Full Database Sync
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = ['Listings', 'Status', 'Actions'];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8">Admin Dashboard</h1>
      <div className="flex space-x-4 border-b border-gray-700 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-bold text-lg transition duration-300 ${
              activeTab === tab
                ? 'text-yellow-400 border-b-2 border-yellow-400'
                : 'text-gray-500 hover:text-yellow-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default AdminPage;
