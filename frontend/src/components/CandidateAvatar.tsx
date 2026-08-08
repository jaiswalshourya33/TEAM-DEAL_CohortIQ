import React from 'react';

/**
 * Extracts initials from candidate name (first letter of first name + first letter of surname).
 * E.g., "Sarah Johnson" -> "SJ", "Alex Turner" -> "AT", "Emily Chen" -> "EC".
 */
export function getCandidateInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  const firstInitial = parts[0][0] || '';
  const lastInitial = parts[parts.length - 1][0] || '';
  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * Deterministic color index based on name hash for unique visual styling per candidate.
 */
function getHashIndex(str: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % max;
}

const AVATAR_PALETTES = [
  {
    gradient: 'from-[#ff9f1c] to-[#ff4081]',
    border: 'border-[#ff9f1c]/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(255,159,28,0.25)]'
  },
  {
    gradient: 'from-emerald-400 to-teal-600',
    border: 'border-emerald-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(52,211,153,0.25)]'
  },
  {
    gradient: 'from-indigo-500 to-purple-600',
    border: 'border-indigo-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(99,102,241,0.25)]'
  },
  {
    gradient: 'from-amber-400 to-orange-600',
    border: 'border-amber-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(251,191,36,0.25)]'
  },
  {
    gradient: 'from-cyan-400 to-blue-600',
    border: 'border-cyan-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.25)]'
  },
  {
    gradient: 'from-rose-500 to-red-600',
    border: 'border-rose-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.25)]'
  },
  {
    gradient: 'from-violet-400 to-fuchsia-600',
    border: 'border-violet-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(167,139,250,0.25)]'
  },
  {
    gradient: 'from-fuchsia-500 to-pink-600',
    border: 'border-fuchsia-400/50',
    text: 'text-white',
    glow: 'shadow-[0_0_12px_rgba(217,70,239,0.25)]'
  }
];

interface CandidateAvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
  isSquare?: boolean;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({
  name,
  size = 'md',
  className = '',
  showOnlineStatus = false,
  isSquare = false,
}) => {
  const initials = getCandidateInitials(name);
  const paletteIndex = getHashIndex(name || 'Candidate', AVATAR_PALETTES.length);
  const palette = AVATAR_PALETTES[paletteIndex];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] font-bold',
    sm: 'w-8 h-8 text-xs font-extrabold',
    md: 'w-10 h-10 text-sm font-black',
    lg: 'w-12 h-12 text-base font-black',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 text-2xl sm:text-3xl font-black'
  }[size];

  const roundedClass = isSquare ? 'rounded-2xl' : 'rounded-full';

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <div
        className={`${sizeClasses} ${roundedClass} bg-gradient-to-br ${palette.gradient} ${palette.text} ${palette.border} ${palette.glow} border flex items-center justify-center select-none font-sans tracking-wider shadow-md transition-all duration-300 transform group-hover:scale-105`}
      >
        <span>{initials}</span>
      </div>
      {showOnlineStatus && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#161310] rounded-full ring-1 ring-emerald-500/50"></span>
      )}
    </div>
  );
};

export default CandidateAvatar;
