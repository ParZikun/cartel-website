import Image from 'next/image';
import { Award, TrendingUp, Users, BarChart4 } from 'lucide-react';
import { toast } from 'sonner';
import { getConfidenceColor } from '../utils/format';

export default function HoldingsCard({ card }) {
    const confidenceColor = getConfidenceColor(card.alt_value_confidence);

    return (
        <div className="card-shine-effect group relative bg-gradient-to-br from-[#1a1625]/80 via-[#0c0a15]/80 to-[#1a1625]/80 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden backdrop-blur-sm">

            {/* Card Image */}
            <div className="relative aspect-[3/4] overflow-hidden bg-black/40">
                <Image
                    src={card.img_url || 'https://placehold.co/300x420/0c0a15/2d3748?text=No+Image'}
                    alt={card.name || 'Card'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-500 w-auto h-auto"
                />

                {/* Grade Badge - Top Right */}
                {card.grade && (
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-accent-gold/30 rounded-lg px-3 py-1.5 z-20">
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
                    {/* ALT Value (Dynamic) */}
                    <div className={`rounded-lg p-3 border ${confidenceColor.border} ${confidenceColor.bg}`}>
                        <div className="flex items-center gap-1 mb-1">
                            <BarChart4 className={`w-3 h-3 ${confidenceColor.text}`} />
                            <p className={`text-xs uppercase tracking-wide ${confidenceColor.text}`}>ALT Value</p>
                        </div>
                        <p className={`text-lg font-bold font-mono ${confidenceColor.text}`}>
                            ${card.alt_value != null ? Number(card.alt_value).toFixed(2) : 'N/A'}
                        </p>
                        {(card.alt_value_lower_bound != null && card.alt_value_upper_bound != null) && (
                            <p className={`text-xs font-mono mt-0.5 opacity-70 ${confidenceColor.text}`}>
                                ${Number(card.alt_value_lower_bound).toFixed(0)} - ${Number(card.alt_value_upper_bound).toFixed(0)}
                            </p>
                        )}
                    </div>

                    {/* Cartel AVG */}
                    <div className="bg-black/40 rounded-lg p-3 border border-accent-gold/20">
                        <div className="flex items-center gap-1 mb-1">
                            <TrendingUp className="w-3 h-3 text-accent-gold" />
                            <p className="text-xs text-accent-gold uppercase tracking-wide">Cartel AVG</p>
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
