import React from 'react';

// Official State Emblem of India (Lion Capital of Ashoka) matching official reference
export const IndiaEmblem: React.FC<{ className?: string }> = ({ className = 'w-7 h-9' }) => (
  <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
    {/* Light theme: deep official slate line-art */}
    <img
      src="/assets/emblem_light.svg"
      alt="State Emblem of India"
      className="w-full h-full object-contain dark:hidden select-none"
    />
    {/* Dark theme: crisp high-contrast silver/white line-art */}
    <img
      src="/assets/emblem_dark.svg"
      alt="State Emblem of India"
      className="w-full h-full object-contain hidden dark:block select-none"
    />
  </div>
);

// Indian Flag Badge
export const IndianFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg viewBox="0 0 30 20" className={`rounded-xs overflow-hidden shadow-xs ${className}`}>
    <rect width="30" height="6.66" fill="#FF9933" />
    <rect y="6.66" width="30" height="6.66" fill="#FFFFFF" />
    <rect y="13.33" width="30" height="6.66" fill="#138808" />
    <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.6" />
    <circle cx="15" cy="10" r="0.4" fill="#000080" />
  </svg>
);

// India Geographic Map with Regional Route Heatmap Points from reference design
export const IndiaMapHeatmap: React.FC<{ className?: string; isDark?: boolean }> = ({
  className = 'w-full h-full',
  isDark = false
}) => {
  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <img
        src={isDark ? '/assets/heatmap_card_dark.png' : '/assets/heatmap_card_light.png'}
        alt="Regional Route Heatmap of India"
        className="w-full h-auto max-h-[220px] object-contain rounded-xl select-none"
      />
    </div>
  );
};

// Sidebar Bottom Cloud with Airplane and Indian Slogan from reference design
export const SidebarCloudAirplane: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <div className="relative w-full overflow-hidden flex flex-col items-center select-none pt-1">
      <img
        src={isDark ? '/assets/sidebar_lower_dark.png' : '/assets/sidebar_lower_light.png'}
        alt="Better Data, Better Decisions, A Stronger India"
        className="w-full h-auto max-h-[310px] object-cover object-bottom select-none pointer-events-none"
      />
    </div>
  );
};

// Official VayuSuchak Emblem Logo (Airplane with Tricolor Contrails & Inflation Bar Chart)
export const VayuSuchakLogo: React.FC<{ className?: string; alt?: string }> = ({
  className = 'w-8 h-8',
  alt = 'VayuSuchak Logo'
}) => (
  <img
    src="/assets/vayusuchak_logo.png"
    alt={alt}
    className={`object-contain select-none shrink-0 ${className}`}
  />
);
