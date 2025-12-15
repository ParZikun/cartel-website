import Image from 'next/image';
import { Award, TrendingUp, Users, BarChart4, Copy, ExternalLink, Clock, DollarSign, ShieldCheck, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { getConfidenceColor, getDifferenceColor } from '../utils/format';

export default function HoldingsCard({ card }) {
    const confidenceColor = getConfidenceColor(card.alt_value_confidence);
    const diffColor = getDifferenceColor(card.diff);

    const copyToClipboard = (e, text) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const isBoosterOrBox = (name, category) => {
        const lowerName = name?.toLowerCase() || '';
        const lowerCat = category?.toLowerCase() || '';
        return lowerName.includes('booster') || lowerName.includes('box') || lowerName.includes('bundle') || lowerName.includes('etb') || lowerCat.includes('sealed') || lowerCat.includes('box');
    };

    const showBoosterOverlay = isBoosterOrBox(card.name, card.category);

    return (
        <div className="card-shine-effect group relative bg-gradient-to-br from-[#1a1625]/80 via-[#0c0a15]/80 to-[#1a1625]/80 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm flex flex-col h-full">

            {/* Card Image Area */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black/40 border-b border-white/10 group-image-container">
                <Image
                    src={card.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=No+Image'}
                    alt={card.name || 'Card'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-500 w-auto h-auto relative z-0"
                />

                {/* Status Badges - Top Left */}
                <div className="absolute top-3 left-3 flex flex-col gap-1 z-20">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg border ${card.is_listed ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                        {card.is_listed ? 'Listed' : 'Unlisted'}
                    </span>
                </div>

                {/* Grade Badge - Top Right */}
                {card.grade && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-accent-gold/30 rounded-lg px-2 py-1 shadow-xl z-20">
                        <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-bold uppercase ${card.grading_company === 'CGC' ? 'text-blue-400' : 'text-gray-400'}`}>{card.grading_company}</span>
                            <span className="text-accent-gold font-bold text-sm tracking-tighter">{card.grade_num}</span>
                        </div>
                    </div>
                )}

                {/* Name Overlay (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 pt-12 bg-gradient-to-t from-[#0c0a15] via-[#0c0a15]/80 to-transparent z-20">
                    <h3 className="font-bold text-white text-sm leading-snug line-clamp-2" title={card.name}>
                        {card.name}
                    </h3>
                </div>

                {/* External Links - Bottom Right (Visible on Hover - Above Name) */}
                <div className="absolute bottom-16 right-3 flex gap-2 translate-y-10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                    {card.alt_asset_id && (
                        <a href={`https://app.alt.xyz/research/${card.alt_asset_id}`} target="_blank" className="p-1.5 bg-black/60 hover:bg-black/90 rounded-full text-white border border-white/10 hover:border-accent-gold transition-colors" title="View on Alt">
                            <Image src="https://cdn.prod.website-files.com/62829b28e6300b34ff739f02/629661dd02bdba04fb424173_ALT-white-logo.png" width={14} height={14} alt="ALT" />
                        </a>
                    )}
                    <a href={`https://magiceden.io/item-details/${card.token_mint}`} target="_blank" className="p-1.5 bg-black/60 hover:bg-black/90 rounded-full text-white border border-white/10 hover:border-accent-gold transition-colors" title="View on Magic Eden">
                        <Image src="https://cdn.prod.website-files.com/614c99cf4f23700c8aa3752a/637db1043720a3ea88e4ea96_public.png" width={14} height={14} alt="ME" />
                    </a>
                </div>
            </div>

            {/* Card Info */}
            <div className="relative p-3 flex-1 flex flex-col space-y-3 bg-[#0c0a15]">

                {/* Meta Info Row */}
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5 w-1/3" title="Grading Cert ID">
                        <Hash className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-300 truncate">{card.grading_id}</span>
                        <button onClick={(e) => copyToClipboard(e, card.grading_id)} className="hover:text-white shrink-0"><Copy className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 w-1/3 border-x border-white/5" title="Insured Value">
                        <ShieldCheck className="w-3 h-3 text-emerald-500/80" />
                        <span className="text-emerald-400 font-bold">${card.insured_value ? Number(card.insured_value).toLocaleString() : '0'}</span>
                    </div>
                    <div className="flex items-center justify-end gap-1.5 w-1/3">
                        <Users className="w-3 h-3" />
                        <span className="text-gray-300">{card.supply || '-'}</span>
                    </div>
                </div>

                {/* Metrics Container with Potential Overlay */}
                <div className="relative">
                    {/* Booster/Box Overlay covering ALL 4 boxes */}
                    {showBoosterOverlay && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl border border-white/10">
                            <div className="transform -rotate-12 border-2 border-dashed border-gray-600 px-4 py-2 rounded-lg bg-black/50">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    No Alt for Box/Bundle
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        {/* Price */}
                        <div className="bg-white/5 rounded p-2 border border-white/5 h-14 flex flex-col justify-between">
                            <span className="text-gray-500 block text-[10px] uppercase">Price</span>
                            <div className="flex flex-col leading-none">
                                {card.is_listed ? (
                                    <>
                                        <span className="text-white font-mono font-bold text-sm">
                                            {card.price_amount ? `${Number(card.price_amount).toFixed(2)} SOL` : 'N/A'}
                                        </span>
                                        {card.price_amount && (
                                            <span className="text-[9px] text-gray-500 font-mono mt-0.5">
                                                ≈ ${(Number(card.price_amount) * 150).toFixed(0)}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-white font-mono font-bold text-sm">N/A</span>
                                )}
                            </div>
                        </div>

                        {/* Cartel Avg */}
                        <div className="bg-white/5 rounded p-2 border border-white/5 relative overflow-hidden h-14 flex flex-col justify-between">
                            {/* CGC Overlay */}
                            {card.grading_company === 'CGC' && !showBoosterOverlay && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                    <span className="text-[10px] font-bold text-gray-400 transform -rotate-12 border border-gray-500/50 px-1 rounded shadow-sm whitespace-nowrap">
                                        No Alt (CGC)
                                    </span>
                                </div>
                            )}
                            <span className="text-gray-500 block text-[10px] uppercase">Cartel Avg</span>
                            <span className="text-accent-gold font-mono font-bold text-sm">
                                ${card.avg_price ? Number(card.avg_price).toLocaleString() : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {/* ALT Value */}
                        <div className={`rounded p-2 border relative overflow-hidden h-16 flex flex-col justify-between ${confidenceColor.border} ${confidenceColor.bg}`}>

                            {/* CGC Overlay */}
                            {card.grading_company === 'CGC' && !showBoosterOverlay && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                    <span className="text-[10px] font-bold text-gray-400 transform -rotate-12 border border-gray-500/50 px-1 rounded shadow-sm whitespace-nowrap">
                                        No Alt (CGC)
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <span className={`text-[10px] uppercase ${confidenceColor.text}`}>Alt Value</span>
                            </div>

                            <div className="flex flex-col">
                                <span className={`font-mono font-bold text-sm ${confidenceColor.text}`}>
                                    ${card.alt_value != null ? Number(card.alt_value).toFixed(2) : '-'}
                                </span>
                                <span className={`text-[9px] opacity-60 font-mono ${confidenceColor.text} truncate`}>
                                    {card.alt_value_lower_bound ? `${Number(card.alt_value_lower_bound).toFixed(0)} - ${Number(card.alt_value_upper_bound).toFixed(0)}` : ''}
                                </span>
                            </div>

                            {/* Confidence - Bottom Right Absolute */}
                            <div className="absolute bottom-1 right-2">
                                <span className={`text-[9px] ${confidenceColor.text} opacity-80 font-bold`}>{card.alt_value_confidence}%</span>
                            </div>
                        </div>

                        {/* Diff/Profit */}
                        <div className={`rounded p-2 border h-16 flex flex-col justify-between ${diffColor.border} ${diffColor.bg}`}>
                            <span className={`text-[10px] uppercase block ${diffColor.text}`}>Diff</span>
                            <div className={`font-mono font-bold text-sm ${diffColor.text}`}>
                                {card.is_listed ? (
                                    <>
                                        {card.diff > 0 ? '+' : ''}{Number(card.diff).toFixed(2)}%
                                    </>
                                ) : (
                                    '0.00%'
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Last Scan & Mint */}
                <div className="mt-auto pt-2 flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {card.last_analyzed_at ? new Date(card.last_analyzed_at).toLocaleDateString() : 'Never'}
                    </span>
                    <button onClick={(e) => copyToClipboard(e, card.token_mint)} className="flex items-center gap-1 hover:text-white transition-colors">
                        MINT <Copy className="w-3 h-3" />
                    </button>
                </div>

                {/* Hover Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}
