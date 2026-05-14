export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'text-gray-400';
    case 'rare': return 'text-blue-400';
    case 'legendary': return 'text-purple-400';
    case 'mythic': return 'text-amber-400';
    default: return 'text-gray-400';
  }
};

export const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'rare': return 'shadow-[0_0_20px_rgba(59,130,246,0.5)]';
    case 'legendary': return 'shadow-[0_0_30px_rgba(168,85,247,0.6)]';
    case 'mythic': return 'shadow-[0_0_40px_rgba(251,191,36,0.7)] animate-pulse';
    default: return '';
  }
};
