'use client';

import { useState } from 'react';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('listings');

  const listings = [
    { id: 1, name: 'Rare Card #1', price: '5.5 SOL', status: 'Autobuy', imageUrl: '/logo.png' },
    { id: 2, name: 'Epic Card #2', price: '12.0 SOL', status: 'Good', imageUrl: '/logo2.png' },
    { id: 3, name: 'Legendary Card #3 - A Very Long Name That Should Be Truncated', price: '25.2 SOL', status: 'Autobuy', imageUrl: '/logo.png' },
    { id: 4, name: 'Common Card #4', price: '1.2 SOL', status: 'Listed', imageUrl: '/logo2.png' },
    { id: 5, name: 'Uncommon Card #5', price: '3.7 SOL', status: 'Good', imageUrl: '/logo.png' },
  ];

  const statusColors = {
    'Autobuy': 'bg-yellow-500/20 text-yellow-400 border border-yellow-600',
    'Good': 'bg-red-500/20 text-red-400 border border-red-600',
    'Listed': 'bg-gray-500/20 text-gray-400 border border-gray-600',
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'listings':
        return (
          <div className="glass p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-black/40 text-accent-gold font-pixel-xs uppercase">
                  <tr>
                    <th className="p-3 text-left"></th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((item) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                      <td className="p-2">
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                      </td>
                      <td className="p-2 truncate max-w-xs">{item.name}</td>
                      <td className="p-2 text-right font-mono">{item.price}</td>
                      <td className="p-2 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${statusColors[item.status] || statusColors['Listed']}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-4 flex flex-col items-center justify-center">
              <p className="text-2xl text-white font-bold">1,234</p>
              <p className="text-xs text-gray-400">Total Listings</p>
            </div>
            <div className="glass p-4 flex flex-col items-center justify-center">
              <p className="text-2xl text-white font-bold">56</p>
              <p className="text-xs text-gray-400">Autobuy Targets</p>
            </div>
            <div className="glass p-4 flex flex-col items-center justify-center">
              <p className="text-2xl text-white font-bold">Online</p>
              <p className="text-xs text-gray-400">Bot Status</p>
            </div>
            <div className="md:col-span-3 mt-4">
                <p className="text-accent-gold font-pixel-s mb-2">Log Console</p>
                <div className="bg-black border border-gray-800 rounded-md p-4 h-64 overflow-y-auto">
                    <pre className="text-green-500 font-mono text-xs">
                        [INFO] Bot started successfully.<br/>
                        [INFO] Connecting to Magic Eden...<br/>
                        [SUCCESS] Connection established.<br/>
                        [INFO] Watching 5 collections.<br/>
                        [DEBUG] Found new listing for "Rare Card #1" at 5.5 SOL.<br/>
                        [WARN] Price is above threshold. Skipping.<br/>
                        [DEBUG] Found new listing for "Epic Card #2" at 12.0 SOL.<br/>
                        [SUCCESS] Autobuy triggered for "Epic Card #2".<br/>
                        [INFO] Transaction submitted.<br/>
                    </pre>
                </div>
            </div>
          </div>
        );
      case 'actions':
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-6 flex flex-col items-center">
                    <h3 className="text-lg text-white font-bold mb-4">Manual Scan</h3>
                    <p className="text-gray-400 text-sm text-center mb-6">Trigger a one-time scan for all targeted collections based on current criteria.</p>
                    <button className="w-full py-2 px-4 rounded-md transition-all border border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                        Run Re-check
                    </button>
                </div>
                <div className="glass p-6 flex flex-col items-center">
                    <h3 className="text-lg text-white font-bold mb-4">Force Sync</h3>
                    <p className="text-gray-400 text-sm text-center mb-6">Perform a full synchronization with the database, updating all listings and states.</p>
                    <button className="w-full py-2 px-4 rounded-md transition-all border border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                        Full Sync
                    </button>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const getTabClass = (tabName) => {
    return activeTab === tabName
      ? 'text-accent-gold border-b-2 border-accent-gold'
      : 'text-gray-500 hover:text-white';
  };

  return (
    <div className="min-h-screen text-primary-text font-mono p-6 bg-primary-dark">
      <h1 className="text-accent-gold font-pixel-xl mb-8">Admin Dashboard</h1>
      
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-gray-800">
          <button onClick={() => setActiveTab('listings')} className={`pb-2 font-bold transition-colors ${getTabClass('listings')}`}>
            Listings
          </button>
          <button onClick={() => setActiveTab('status')} className={`pb-2 font-bold transition-colors ${getTabClass('status')}`}>
            Status
          </button>
          <button onClick={() => setActiveTab('actions')} className={`pb-2 font-bold transition-colors ${getTabClass('actions')}`}>
            Actions
          </button>
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminPage;
