"use client";

import React, { useState } from 'react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('Listings');
  const tabs = ['Listings', 'Status', 'Actions'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Listings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">All Listings</h2>
            <p className="text-gray-400">Table of all listings will go here.</p>
          </div>
        );
      case 'Status':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">App Status</h3>
                <p className="text-green-400 font-bold">Running</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Last Scan</h3>
                <p className="text-gray-300">2 minutes ago</p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Deals Found</h3>
                <p className="text-gray-300">12</p>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Log Viewer</h3>
            <div className="bg-black p-4 rounded-lg">
              <pre className="font-mono text-green-400 text-sm overflow-x-auto h-48">
                <code>
                  [2025-11-17 10:30:00] INFO: Application started successfully.<br />
                  [2025-11-17 10:31:15] INFO: Scanning Magic Eden for new listings...<br />
                  [2025-11-17 10:31:45] INFO: Found 5 new listings below floor price.<br />
                  [2025-11-17 10:32:01] WARN: High slippage detected for mint XYZ.<br />
                </code>
              </pre>
            </div>
          </div>
        );
      case 'Actions':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Manual Actions</h2>
            <div className="space-y-8">
              <div className="bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Re-check Skipped Listings</h3>
                <p className="text-gray-400 mb-4">Force the application to re-evaluate listings that were previously skipped due to errors or other conditions.</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Run Re-check
                </button>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg border border-red-500/50">
                <h3 className="text-xl font-semibold mb-4">Full Database Sync</h3>
                <p className="text-gray-400 mb-4">Perform a full synchronization with the source data, potentially overwriting existing entries. This is a long-running and resource-intensive task.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                  Start Full Sync
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-yellow-500 text-yellow-500'
                  : 'border-transparent text-gray-400 hover:text-white hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;