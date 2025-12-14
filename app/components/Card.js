import Image from 'next/image';
import { WalletCards, TrendingDown, Tag, BarChart4, Copy, CheckCircle, XCircle, Loader, ShieldCheck, Hash, Users } from 'lucide-react';
import { useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { getConfidenceColor, getDifferenceColor } from '../utils/format';
import { toast } from 'sonner';

const getCategoryStyles = (category) => {
    const styles = {
        'AUTOBUY': {
            glow: 'shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)]',
            border: 'border-yellow-500/40',
            badge: 'bg-yellow-500 text-black border-yellow-500'
        },
        'GOOD': {
            glow: 'shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]',
            border: 'border-red-500/40',
            badge: 'bg-red-500 text-white border-red-500'
        },
        'OK': {
            glow: 'shadow-[0_0_20px_-5px_rgba(56,189,248,0.4)]',
            border: 'border-sky-500/40',
            badge: 'bg-sky-500 text-white border-sky-500'
        },
    };
    const fallback = {
        glow: 'shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)]',
        border: 'border-purple-500/40',
        badge: 'bg-purple-500 text-white border-purple-500'
    };
    return styles[category] || fallback;
}

const timeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const intervals = { year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60 };
    if (seconds < intervals.hour) return Math.floor(seconds / intervals.minute) + "m ago";
    if (seconds < intervals.day) return Math.floor(seconds / intervals.hour) + "h ago";
    if (seconds < intervals.month) return Math.floor(seconds / intervals.day) + "d ago";
    return Math.floor(seconds / intervals.year) + "y ago";
}

export default function Card({ listing, solPriceUSD, priority }) {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const { token } = useAuth();
    const { priorityFee } = useTransaction();

    const [snipeState, setSnipeState] = useState('idle');

    const listingPriceUSD = listing.price_amount ? listing.price_amount * solPriceUSD : null;
    const diffPercent = (listingPriceUSD && listing.alt_value > 0) ? (((listingPriceUSD - listing.alt_value) / listing.alt_value) * 100) : null;
    const styles = getCategoryStyles(listing.cartel_category);

    const confidenceColor = getConfidenceColor(listing.alt_value_confidence);
    const differenceColor = getDifferenceColor(diffPercent);

    const copyToClipboard = (e, text) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(text);
        toast.success('Mint address copied to clipboard');
    };

    const handleSnipe = async (e) => {
        e.preventDefault();
        if (!publicKey) {
            toast.error('Please connect your wallet first!');
            return;
        }
        setSnipeState('loading');
        toast.info('Initiating snipe transaction...');

        try {
            // Updated to use Python Backend Endpoint
            const response = await fetch('/api/buy/create-tx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    buyer: publicKey.toBase58(),
                    tokenMint: listing.token_mint,
                    price: listing.price_amount,
                    priorityFee: priorityFee,
                }),
            });

            if (!response.ok) throw new Error('Failed to get transaction instructions');
            const data = await response.json();
            const txBuffer = Buffer.from(data.tx, 'base64');

            let transaction;
            try {
                transaction = VersionedTransaction.deserialize(txBuffer);
            } catch (e) {
                transaction = Transaction.from(txBuffer);
            }

            if (!signTransaction) throw new Error('Wallet does not support signing transactions.');
            const signedTx = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signedTx.serialize());
            await connection.confirmTransaction(signature, 'processed');

            setSnipeState('success');
            toast.success('Snipe successful! Transaction confirmed.');
            setTimeout(() => setSnipeState('idle'), 3000);

        } catch (error) {
            console.error("Snipe failed:", error);
            setSnipeState('error');
            toast.error(`Snipe failed: ${error.message}`);
            setTimeout(() => setSnipeState('idle'), 3000);
        }
    };

    const getButtonContent = () => {
        switch (snipeState) {
            case 'loading': return <Loader className="w-5 h-5 animate-spin text-black" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
            default: return <Image src="/logo.png" width={20} height={20} alt="Logo" className="object-contain" />;
        }
    };

    return (
        <div className={`group relative bg-[#13111a] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:${styles.glow} hover:${styles.border}`}>

            {/* Image Section with Overlay */}
            <div className="relative aspect-[3/4] w-full bg-[#0c0a15]">
                <Image
                    src={listing.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=N/A'}
                    alt={listing.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105 w-auto h-auto"
                    priority={priority}
                />

                {/* Category Badge (Top Left) */}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-lg ${styles.badge}`}>
                    {listing.cartel_category}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#13111a] via-[#13111a]/90 to-transparent top-[45%]" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                    {/* Name */}
                    <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 drop-shadow-md" title={listing.name}>
                        {listing.name}
                    </h3>

                    {/* Info Row */}
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1" title="Grading ID"><Hash className="w-3 h-3" /> {listing.grading_id || 'N/A'}</span>
                            <span className="flex items-center gap-1" title="Insured Value"><ShieldCheck className="w-3 h-3" /> ${listing.insured_value ? Number(listing.insured_value).toFixed(0) : 'N/A'}</span>
                        </div>
                        <span>{timeAgo(listing.listed_at)}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="p-3 bg-[#13111a]">
                <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Price */}
                    <div className="bg-[#0c0a15] rounded-xl p-3 border border-white/10 group/box relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover/box:opacity-40 transition-opacity">
                            <Tag className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-[9px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">Price</p>
                        <div className="text-lg font-bold text-white">{listing.price_amount?.toFixed(2)} <span className="text-[10px] text-gray-500 font-normal">SOL</span></div>
                        <p className="text-[9px] text-gray-500 font-mono">~${listingPriceUSD?.toFixed(0)}</p>
                    </div>

                    {/* Difference */}
                    <div className={`bg-[#0c0a15] rounded-xl p-3 border ${differenceColor.border} group/box relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover/box:opacity-40 transition-opacity">
                            <TrendingDown className={`w-4 h-4 ${differenceColor.text}`} />
                        </div>
                        <p className={`text-[9px] uppercase tracking-wider font-bold mb-0.5 ${differenceColor.text}`}>Difference</p>
                        <div className={`text-lg font-bold ${differenceColor.text}`}>
                            {diffPercent ? `${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(2)}%` : '-'}
                        </div>
                        <p className={`text-[9px] opacity-60 ${differenceColor.text}`}>vs Alt</p>
                    </div>

                    {/* Alt Value */}
                    <div className={`bg-[#0c0a15] rounded-xl p-3 border ${confidenceColor.border} group/box relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover/box:opacity-40 transition-opacity">
                            <BarChart4 className={`w-4 h-4 ${confidenceColor.text}`} />
                        </div>
                        <p className={`text-[9px] uppercase tracking-wider font-bold mb-0.5 ${confidenceColor.text}`}>Alt Value</p>
                        <div className={`text-lg font-bold ${confidenceColor.text}`}>${listing.alt_value ? Number(listing.alt_value).toFixed(2) : '-'}</div>
                        <p className={`text-[9px] opacity-60 font-mono ${confidenceColor.text} truncate`}>
                            {listing.alt_value_lower_bound ? `${Number(listing.alt_value_lower_bound).toFixed(0)} - ${Number(listing.alt_value_upper_bound).toFixed(0)}` : ''}
                        </p>
                        {/* Confidence - Bottom Right Absolute */}
                        <div className="absolute bottom-1 right-2">
                            <span className={`text-[9px] ${confidenceColor.text} opacity-80 font-bold`}>{listing.alt_value_confidence}%</span>
                        </div>
                    </div>

                    {/* Cartel Avg */}
                    <div className="bg-[#0c0a15] rounded-xl p-3 border border-accent-gold/20 group/box relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1.5 opacity-20 group-hover/box:opacity-40 transition-opacity">
                            <Users className="w-4 h-4 text-accent-gold" />
                        </div>
                        <p className="text-[9px] text-accent-gold uppercase tracking-wider font-bold mb-0.5">Cartel Avg</p>
                        <div className="text-lg font-bold text-accent-gold">${listing.avg_price ? Number(listing.avg_price).toFixed(2) : '-'}</div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="space-y-3">
                    {/* Links Row */}
                    <div className="flex justify-between items-center px-1">
                        <div className="flex gap-2">
                            <a href={listing.alt_asset_id ? `https://app.alt.xyz/research/${listing.alt_asset_id}` : '#'} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="ALT.xyz">
                                <Image src="https://cdn.prod.website-files.com/62829b28e6300b34ff739f02/629661dd02bdba04fb424173_ALT-white-logo.png" width={12} height={12} alt="ALT" />
                            </a>
                            <a href={`https://collectorcrypt.com/assets/solana/${listing.token_mint}`} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="Collector Crypt">
                                <Image src="https://www.marketbeat.com/logos/cryptocurrencies/collector-crypt-CARDS.png?v=2025-09-12" width={12} height={12} className="rounded-full bg-white p-[1px]" alt="CC" />
                            </a>
                            <a href={`https://magiceden.io/item-details/${listing.token_mint}`} target="_blank" className="opacity-70 hover:opacity-100 hover:scale-110 transition-all border border-accent-gold rounded-full p-1 bg-black/40 backdrop-blur-sm" title="Magic Eden">
                                <Image src="https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/637db1043720a3ea88e4ea96_public.png" width={12} height={12} alt="ME" />
                            </a>
                        </div>
                        <button onClick={(e) => copyToClipboard(e, listing.token_mint)} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider font-medium">
                            <Copy className="w-3 h-3" /> Copy Mint
                        </button>
                    </div>

                    {/* Snipe Button (Gold) */}
                    <button
                        onClick={handleSnipe}
                        disabled={!listing.is_listed || snipeState === 'loading' || snipeState === 'success'}
                        className={`
                            w-full relative overflow-hidden rounded-lg text-sm py-3 transition-all duration-300
                            flex items-center justify-center gap-2 tracking-wide
                            ${snipeState === 'idle'
                                ? 'bg-yellow-500/10 border border-yellow-500 hover:bg-yellow-500/20 hover:scale-[1.02] hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)] shadow-[0_0_10px_-5px_rgba(234,179,8,0.2)]'
                                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'}
                        `}
                    >
                        {getButtonContent()}
                        <div className="relative pokemon-title">
                            <span className={`pokemon-title-solid font-pokemon relative z-10 ${snipeState === 'idle' ? 'text-yellow-500' : 'text-gray-500'}`}>
                                {snipeState === 'idle' ? 'SNIPE NOW' : snipeState === 'loading' ? 'PROCESSING...' : snipeState === 'success' ? 'SNIPED!' : 'FAILED'}
                            </span>
                            {snipeState === 'idle' && (
                                <span className="pokemon-title-outline font-pokemon-hollow absolute inset-0 z-20 pointer-events-none text-blue-500">
                                    SNIPE NOW
                                </span>
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}