'use client';

import { useState } from 'react';
import Image from 'next/image';

const getStatusBadgeClass = (category) => {
    const styles = {
        'AUTOBUY': 'bg-yellow-400/10 text-yellow-300',
        'GOOD': 'bg-red-500/10 text-red-400',
        'OK': 'bg-sky-500/10 text-sky-300',
    };
    return styles[category] || 'bg-gray-500/10 text-gray-400';
};

const mockListings = [
    { id: 1, name: 'CryptoPunk #7804', price: 4200.69, status: 'AUTOBUY', img: 'https://i.seadn.io/gcs/files/c8d46891c548226933889188810766c4.png?auto=format&w=128' },
    { id: 2, name: 'Bored Ape Yacht Club #3749', price: 89.99, status: 'GOOD', img: 'https://i.seadn.io/gcs/files/3e76424c97f3c1c11a32b355523001f7.png?auto=format&w=128' },
    { id: 3, name: 'Pudgy Penguin #6873', price: 4.20, status: 'OK', img: 'https://i.seadn.io/gcs/files/a6a81f24436519415b832838b26f714a.png?auto=format&w=128' },
    { id: 4, name: 'DeGod #3251', price: 2.5, status: 'GOOD', img: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeic57edeu3tc2fb3yma52r2o2vj5pu3l57mtmn3hrvjrsy3u5a6gza.ipfs.nftstorage.link/' },
    { id: 5, name: 'Claynosaurz #1111', price: 105, status: 'AUTOBUY', img: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://bafybeih3s22a25qn2yixw2z4avb4ey5o3gm4pnbqjgh3j2f2j3w7vef5qa.ipfs.nftstorage.link/' },
];

const mockStats = {
    listings: 128,
    marketValue: '$1.2M',
    lastSync: '2 minutes ago',
};

const mockLogs = [
    '[INFO] SYNC_STARTED: Full market sync initiated.',
    '[INFO] API_FETCH: Fetched 500 items from MagicEden.',
    '[SUCCESS] DB_WRITE: Stored 480 new/updated listings.',
    '[WARN] ANALYSIS: 2 listings flagged as AUTOBUY.',
    '[WARN] ANALYSIS: 15 listings flagged as GOOD.',
    '[SUCCESS] SYNC_COMPLETE: Sync finished in 45.3s.',
    '[INFO] WAITING: Next sync in 10 minutes.',
];

const ListingsTab = () => (
    <div className="glass rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
            <thead className="bg-black/40 text-accent-gold font-pixel-xs uppercase">
                <tr>
                    <th className="px-6 py-3 text-left">Image</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Price (SOL)</th>
                    <th className="px-6 py-3 text-left">Status</th>
                </tr>
            </thead>
            <tbody>
                {mockListings.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                            <Image src={item.img} alt={item.name} width={40} height={40} className="rounded-md" />
                        </td>
                        <td className="px-6 py-4 truncate max-w-xs">{item.name}</td>
                        <td className="px-6 py-4 font-mono">{item.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(item.status)}`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const StatusTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400">Live Listings</span>
            <span className="text-2xl text-white font-bold">{mockStats.listings}</span>
        </div>
        <div className="glass p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400">Total Market Value</span>
            <span className="text-2xl text-white font-bold">{mockStats.marketValue}</span>
        </div>
        <div className="glass p-4 rounded-xl flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400">Last Sync</span>
            <span className="text-2xl text-white font-bold">{mockStats.lastSync}</span>
        </div>
        <div className="md:col-span-3 mt-4">
            <div className="bg-black border border-gray-800 rounded-lg p-4 h-64 overflow-y-auto">
                <pre className="text-green-500 font-mono text-xs">
                    {mockLogs.join('\n')}
                </pre>
            </div>
        </div>
    </div>
);

const ActionsTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-2">Trigger Re-check</h3>
            <p className="text-sm text-gray-400 mb-4">Force a fast re-check of all currently tracked listings on the marketplace.</p>
            <button className="w-full px-4 py-2 rounded-md font-semibold border border-blue-500 text-blue-400 hover:bg-blue-500/10 transition-colors">
                Run Re-check
            </button>
        </div>
        <div className="glass p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-2">Trigger Full Sync</h3>
            <p className="text-sm text-gray-400 mb-4">Perform a deep sync, discovering new items and updating all data from scratch.</p>
            <button className="w-full px-4 py-2 rounded-md font-semibold border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors">
                Full Sync
            </button>
        </div>
    </div>
);


export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('Listings');
    const tabs = ['Listings', 'Status', 'Actions'];

    return (
        <div className="min-h-screen text-primary-text font-mono p-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-accent-gold font-pixel-xl mb-8 text-3xl">Admin Dashboard</h1>

                <div className="border-b border-gray-700 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${activeTab === tab
                                    ? 'border-accent-gold text-accent-gold'
                                    : 'border-transparent text-gray-500 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div>
                    {activeTab === 'Listings' && <ListingsTab />}
                    {activeTab === 'Status' && <StatusTab />}
                    {activeTab === 'Actions' && <ActionsTab />}
                </div>
            </div>
        </div>
    );
}
