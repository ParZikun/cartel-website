import Image from 'next/image';
import { Award, TrendingUp, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function HoldingsCard({ card }) {
    return (
        <div className="rotating-border-glow glow-purple group relative bg-gradient-to-br from-[#1a1625]/80 via-[#0c0a15]/80 to-[#1a1625]/80 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden backdrop-blur-sm">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/10 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none rounded-xl" />

            {/* Card Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                <Image
                    src={card.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=No+Image'}
                    alt={card.name || 'Card'}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Grade Badge - Top Right */}
                {card.grade && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-accent-gold/30 rounded-lg px-3 py-1.5">
                        <div className="flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-accent-gold" />
                            <span className="text-white font-bold text-sm">{card.grade}</span>
                            <span className="text-accent-gold font-bold text-lg">{card.grade_num}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Card Info */}
            <div className="relative p-4 space-y-3">
                {/* Card Name */}
                <h3 className="font-bold text-white text-base leading-tight line-clamp-2 min-h-[2.5rem]" title={card.name}>
                    {card.name}
                </h3>

                {/* Grading ID & Pop */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <span className="font-mono">ID:</span>
                        <span className="font-mono text-white">{card.grading_id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Users className="w-3 h-3" />
                        <span className="font-mono text-white">{card.supply || 'N/A'}</span>
                    </div>
                </div>

                {/* Value Grid */}
                <div className="grid grid-cols-2 gap-2">
                    {/* ALT Value */}
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-blue-400" />
                            <p className="text-xs text-gray-400 uppercase tracking-wide">ALT Value</p>
                        </div>
                        <p className="text-lg font-bold text-white font-mono">
                            ${card.alt_value != null ? Number(card.alt_value).toFixed(2) : 'N/A'}
                        </p>
                        {(card.alt_value_lower_bound != null && card.alt_value_upper_bound != null) && (
                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                ${Number(card.alt_value_lower_bound).toFixed(2)} - ${Number(card.alt_value_upper_bound).toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Cartel AVG */}
                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-accent-gold" />
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Cartel AVG</p>
                        </div>
                        <p className="text-lg font-bold text-accent-gold font-mono">
                            ${card.avg_price != null ? Number(card.avg_price).toFixed(2) : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">&nbsp;</p>
                    </div>
                </div>

                {/* Hover Glow Line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </div>
    );
}
