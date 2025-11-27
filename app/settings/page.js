'use client';

import { useState } from 'react';
import { Save, Bell, Zap, Percent, Shield, CheckCircle, Database, AlertTriangle } from 'lucide-react';

import { toast } from 'sonner';

export default function SettingsPage() {
    // State
    const [autoBuyEnabled, setAutoBuyEnabled] = useState(false);
    const [maxPrice, setMaxPrice] = useState(5.0);
    const [priorityFee, setPriorityFee] = useState(0.0001); // Default 0.0001 SOL
    const [slippage, setSlippage] = useState(1.0); // Default 1%
    const [thresholds, setThresholds] = useState({
        gold: 30,
        red: 20,
        blue: 10
    });
    const [pushEnabled, setPushEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Settings saved successfully');
        }, 1000);
    };

    const handleFullSync = () => {
        toast.info('Starting full database sync...');
        // Simulate sync process
        setTimeout(() => {
            toast.success('Full database sync completed');
        }, 3000);
    };

    const handleTestNotification = () => {
        toast.info('This is a test notification');
    };

    return (
        <div className="w-full h-full p-6 space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white font-pokemon-solid tracking-wide">Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your trading bot parameters and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-gold text-black font-bold hover:bg-accent-gold/90 transition-all shadow-[0_0_20px_-5px_rgba(255,215,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            <span>Save Changes</span>
                        </>
                    )}
                </button>
            </div>

            {/* Transactions Section */}
            <section className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-24 h-24 text-accent-gold" />
                </div>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent-gold/10 border border-accent-gold/20">
                        <Zap className="w-5 h-5 text-accent-gold" />
                    </div>
                    Transactions
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Auto-Buy Toggle */}
                    <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                        <div>
                            <label className="text-white font-medium block">Auto-Buy Enabled</label>
                            <p className="text-sm text-gray-400 mt-1">Automatically purchase cards meeting criteria.</p>
                        </div>
                        <button
                            onClick={() => setAutoBuyEnabled(!autoBuyEnabled)}
                            className={`
                                relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:ring-offset-2 focus:ring-offset-black
                                ${autoBuyEnabled ? 'bg-accent-gold' : 'bg-gray-700'}
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                                    ${autoBuyEnabled ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>

                    {/* Max Price Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Global Max Price (SOL)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
                                step="0.1"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">SOL</span>
                        </div>
                    </div>

                    {/* Priority Fee Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Priority Fee (SOL)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={priorityFee}
                                onChange={(e) => setPriorityFee(parseFloat(e.target.value) || 0)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
                                step="0.000001"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">SOL</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-mono px-1">
                            <span>≈ {(priorityFee * 1e9).toLocaleString()} lamports</span>
                            <span>≈ ${(priorityFee * 150).toFixed(6)} USD</span> {/* Assuming $150 SOL for now */}
                        </div>
                    </div>

                    {/* Slippage Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Slippage Tolerance</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={slippage}
                                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
                                step="0.1"
                                max="100"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Snipe Thresholds Section */}
            <section className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Percent className="w-24 h-24 text-blue-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Percent className="w-5 h-5 text-blue-400" />
                    </div>
                    Snipe Thresholds
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Gold Tier */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-yellow-400">Gold Tier Discount</label>
                        <div className="relative group/input">
                            <input
                                type="number"
                                value={thresholds.gold}
                                onChange={(e) => setThresholds({ ...thresholds, gold: parseInt(e.target.value) })}
                                className="w-full bg-black/40 border border-yellow-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors font-mono group-hover/input:border-yellow-500/30"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>

                    {/* Red Tier */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-red-400">Red Tier Discount</label>
                        <div className="relative group/input">
                            <input
                                type="number"
                                value={thresholds.red}
                                onChange={(e) => setThresholds({ ...thresholds, red: parseInt(e.target.value) })}
                                className="w-full bg-black/40 border border-red-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors font-mono group-hover/input:border-red-500/30"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>

                    {/* Blue Tier */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-sky-400">Blue Tier Discount</label>
                        <div className="relative group/input">
                            <input
                                type="number"
                                value={thresholds.blue}
                                onChange={(e) => setThresholds({ ...thresholds, blue: parseInt(e.target.value) })}
                                className="w-full bg-black/40 border border-sky-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors font-mono group-hover/input:border-sky-500/30"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notifications Section */}
            <section className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Bell className="w-24 h-24 text-purple-400" />
                </div>

                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <Bell className="w-5 h-5 text-purple-400" />
                    </div>
                    Notifications
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/20 p-6 rounded-xl border border-white/5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-gray-800 text-gray-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-lg">Web Push Notifications</h3>
                            <p className="text-gray-400 text-sm mt-1 max-w-md">
                                Receive instant alerts when a new card matching your criteria is listed or when a snipe is successful.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleTestNotification}
                            className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-colors border border-white/10"
                        >
                            Test Notification
                        </button>

                        <button
                            onClick={() => setPushEnabled(!pushEnabled)}
                            className={`
                                relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-black
                                ${pushEnabled ? 'bg-purple-500' : 'bg-gray-700'}
                            `}
                        >
                            <span
                                className={`
                                    inline-block h-5 w-5 transform rounded-full bg-white transition-transform
                                    ${pushEnabled ? 'translate-x-6' : 'translate-x-1'}
                                `}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* Danger Zone Section */}
            <section className="glass rounded-2xl p-8 border border-red-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertTriangle className="w-24 h-24 text-red-500" />
                </div>

                <h2 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    Danger Zone
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/20 p-6 rounded-xl border border-red-500/10">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-lg">Full Database Sync</h3>
                            <p className="text-gray-400 text-sm mt-1 max-w-md">
                                Pulls all data from Magic Eden and the database to recheck all SKIP listings and potential misses.
                                <span className="block mt-2 text-red-400 font-medium">
                                    Disclaimer: This process takes time and may delay the scanning and pinging of new deals.
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleFullSync}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium whitespace-nowrap"
                    >
                        <Database className="w-4 h-4" />
                        <span>Start Full Sync</span>
                    </button>
                </div>
            </section>
        </div>
    );
}
