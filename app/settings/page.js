'use client';

import { useState, useEffect } from 'react';
import { Save, Bell, Zap, Percent, Shield, CheckCircle, Database, AlertTriangle, Key, Server, Gauge } from 'lucide-react';
import { toast } from 'sonner';

// In a real app, this would come from a wallet provider (Phantom, etc.)
// For this bot, we treat it as a single-user system associated with this "admin" wallet identifier.
const ADMIN_WALLET = "ADMIN_USER_WALLET_V1";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Core Settings
    const [settings, setSettings] = useState({
        auto_buy_enabled: false,
        max_price: 5.0,
        priority_fee: 0.005,
        slippage: 1.0,
        rpc_endpoint: 'https://api.mainnet-beta.solana.com',
        jito_tip_amount: 0.001,
        encrypted_private_key: '',
        gold_discount_percent: 30,
        red_discount_percent: 20,
        blue_discount_percent: 10,
        push_enabled: true
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/settings/${ADMIN_WALLET}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && !data.error) {
                        setSettings(prev => ({ ...prev, ...data }));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch settings:", error);
                toast.error("Failed to load settings from server.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`http://localhost:8000/api/settings/${ADMIN_WALLET}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                toast.success('Settings saved successfully');
            } else {
                throw new Error('Failed to save');
            }
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };


    const handleFullSync = async () => {
        toast.info('Starting full database sync...');
        try {
            const res = await fetch('http://localhost:7071/api/full-recheck', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                toast.success(data.message || 'Full database sync completed successfully!');
            } else {
                const err = await res.text();
                throw new Error(err);
            }
        } catch (error) {
            console.error("Sync Error:", error);
            toast.error('Failed to start sync', { description: error.message });
        }
    };

    if (loading) {
        return <div className="p-20 text-center text-gray-500">Loading settings...</div>;
    }

    return (
        <div className="w-full h-full p-6 space-y-8 max-w-5xl mx-auto pb-20">
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
                    Transactions & Snipe Config
                </h2>

                <div className="space-y-6">
                    {/* Auto-Buy Toggle */}
                    <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                        <div>
                            <label className="text-white font-medium block">Auto-Buy Enabled</label>
                            <p className="text-sm text-gray-400 mt-1">Automatically purchase cards meeting criteria.</p>
                        </div>
                        <button
                            onClick={() => handleChange('auto_buy_enabled', !settings.auto_buy_enabled)}
                            className={`
                                relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:ring-offset-2 focus:ring-offset-black
                                ${settings.auto_buy_enabled ? 'bg-accent-gold' : 'bg-gray-700'}
                            `}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${settings.auto_buy_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Max Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Global Max Price (SOL)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.max_price}
                                    onChange={(e) => handleChange('max_price', parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
                                    step="0.1"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">SOL</span>
                            </div>
                        </div>

                        {/* Slippage */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Slippage Tolerance</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={settings.slippage}
                                    onChange={(e) => handleChange('slippage', parseFloat(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-gold/50 transition-colors font-mono"
                                    step="0.1"
                                    max="100"
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        {/* Priority Fee */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Gauge className="w-4 h-4 text-purple-400" />
                                <label className="text-sm font-medium text-gray-300">Priority Fee (SOL)</label>
                            </div>
                            <input
                                type="number"
                                value={settings.priority_fee}
                                onChange={(e) => handleChange('priority_fee', parseFloat(e.target.value) || 0)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                                step="0.000001"
                            />
                            <div className="text-xs text-gray-500 font-mono">≈ ${(settings.priority_fee * 150).toFixed(6)} USD</div>
                        </div>

                        {/* Jito Tip */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <label className="text-sm font-medium text-gray-300">Jito Bundle Tip (SOL)</label>
                            </div>
                            <input
                                type="number"
                                value={settings.jito_tip_amount}
                                onChange={(e) => handleChange('jito_tip_amount', parseFloat(e.target.value) || 0)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors font-mono"
                                step="0.00001"
                            />
                            <div className="text-xs text-gray-500 font-mono">For faster transaction inclusion</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Connection & Security Section */}
            <section className="glass rounded-2xl p-8 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Server className="w-24 h-24 text-sky-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <Server className="w-5 h-5 text-sky-400" />
                    </div>
                    Connection & Security
                </h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">RPC Endpoint URL</label>
                        <input
                            type="text"
                            value={settings.rpc_endpoint}
                            onChange={(e) => handleChange('rpc_endpoint', e.target.value)}
                            placeholder="https://api.mainnet-beta.solana.com"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-yellow-500">
                            <Key className="w-4 h-4" />
                            <label className="text-sm font-medium">Private Key (Example / Encrypted)</label>
                        </div>

                        <input
                            type="password"
                            value={settings.encrypted_private_key || ''}
                            onChange={(e) => handleChange('encrypted_private_key', e.target.value)}
                            placeholder="Base58 Private Key..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors font-mono text-sm"
                        />
                        <p className="text-xs text-yellow-500/60 mt-1">
                            Warning: Stored in database. In production, use environment variables or a vault.
                        </p>
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
                                value={settings.gold_discount_percent}
                                onChange={(e) => handleChange('gold_discount_percent', parseInt(e.target.value))}
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
                                value={settings.red_discount_percent}
                                onChange={(e) => handleChange('red_discount_percent', parseInt(e.target.value))}
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
                                value={settings.blue_discount_percent}
                                onChange={(e) => handleChange('blue_discount_percent', parseInt(e.target.value))}
                                className="w-full bg-black/40 border border-sky-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500/50 transition-colors font-mono group-hover/input:border-sky-500/30"
                            />
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Danger Zone Section */}
            <section className="glass rounded-2xl p-8 border border-red-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Database className="w-24 h-24 text-red-500" />
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
                                Pulls all data from Magic Eden and the database to recheck all SKIP listings.
                                <span className="block mt-2 text-red-400 font-medium">
                                    Disclaimer: Optimized to skip items updated &lt;24h ago.
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
