import React from 'react';

interface CohortIQLogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showSubtitle?: boolean;
  onClick?: () => void;
  className?: string;
}

export const CohortIQLogo: React.FC<CohortIQLogoProps> = ({
  theme = 'dark',
  size = 'md',
  showBadge = true,
  showSubtitle = false,
  onClick,
  className = ''
}) => {
  const isLight = theme === 'light';

  // Icon sizing
  const iconSizeClasses = {
    sm: 'w-8 h-8 rounded-lg text-lg',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl',
    lg: 'w-12 h-12 rounded-2xl text-2xl'
  }[size];

  // Main text sizing
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
      title={onClick ? 'Return to Start Page' : undefined}
    >
      {/* Logo Square Icon Badge */}
      <div
        className={`${iconSizeClasses} flex items-center justify-center font-black shadow-md shrink-0 transition-transform duration-300 ${
          onClick ? 'group-hover:scale-105' : ''
        } ${
          isLight
            ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
            : 'bg-gradient-to-br from-[#ffc499] to-[#f4a261] text-[#161310] shadow-[#ffc499]/20'
        }`}
      >
        C
      </div>

      {/* Brand Title & Badges */}
      <div>
        <div className="flex items-center gap-2">
          <span className={`font-header ${textSizeClasses} font-bold tracking-tight leading-none ${
            isLight ? 'text-slate-900' : 'text-[#e9e1dc]'
          }`}>
            Cohort<span className={isLight ? 'text-blue-600' : 'text-[#ffc499]'}>IQ</span>
          </span>

          {showBadge && (
            <span
              className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border rounded-full shrink-0 hidden sm:inline-block ${
                isLight
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-[#ffc499]/10 text-[#ffc499] border-[#ffc499]/30'
              }`}
            >
              v2.4 AI Platform
            </span>
          )}
        </div>

        {showSubtitle && (
          <p className={`text-xs hidden sm:block mt-0.5 ${isLight ? 'text-slate-500' : 'text-[#a08d80]'}`}>
            Candidate Intelligence & Live Technical Interviewer
          </p>
        )}
      </div>
    </div>
  );
};
