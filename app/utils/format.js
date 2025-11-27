
export const getConfidenceColor = (confidence) => {
    const conf = Number(confidence);
    if (conf > 70) return { text: 'text-green-400', border: 'border-green-500/20', bg: 'bg-green-500/10' };
    if (conf >= 40) return { text: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/10' };
    return { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' };
};

export const getDifferenceColor = (diff) => {
    const difference = Number(diff);
    if (difference < -30) return { text: 'text-accent-gold', border: 'border-accent-gold/20', bg: 'bg-accent-gold/10' };
    if (difference < -20) return { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' };
    if (difference < -10) return { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/10' };
    return { text: 'text-gray-400', border: 'border-white/10', bg: 'bg-white/5' };
};
