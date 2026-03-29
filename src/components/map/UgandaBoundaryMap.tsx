interface LegendItem {
  label: string;
  color: string;
}

interface UgandaBoundaryMapProps {
  className?: string;
  isDarkMode: boolean;
  badgeText?: string;
  legendTitle?: string;
  legendItems?: LegendItem[];
}

const FAO_BLUE = '#318DDE';

export default function UgandaBoundaryMap({
  className = '',
  isDarkMode,
  badgeText = 'Uganda',
  legendTitle,
  legendItems = [],
}: UgandaBoundaryMapProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`} />
      <img
        src="/uganda-map.png"
        alt="Uganda boundary map"
        className="absolute inset-0 h-full w-full object-contain"
      />

      {legendTitle && legendItems.length > 0 && (
        <div className={`absolute bottom-2 left-2 rounded-lg p-2 shadow-sm ${isDarkMode ? 'bg-slate-800/90' : 'bg-white/90'}`}>
          <div className={`mb-1 text-[10px] font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{legendTitle}</div>
          <div className="space-y-1">
            {legendItems.map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-[9px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="absolute top-2 left-2">
        <span
          className="rounded px-2 py-0.5 text-[10px] font-medium shadow-sm"
          style={{
            backgroundColor: isDarkMode ? `${FAO_BLUE}33` : `${FAO_BLUE}22`,
            color: FAO_BLUE,
          }}
        >
          {badgeText}
        </span>
      </div>
    </div>
  );
}
