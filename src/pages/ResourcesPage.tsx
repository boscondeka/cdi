import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Map as MapIcon, 
  BookOpen, 
  Search,
  AlertCircle
} from 'lucide-react';

interface ResourcesPageProps {
  isDarkMode?: boolean;
}

const FAO_BLUE = '#318DDE';

const resourceCategories = [
  {
    title: 'Policy Documents',
    icon: BookOpen,
    description: 'National guidelines, frameworks, and strategic planning documents.',
    items: [
      { title: 'National Disaster Preparedness Plan 2025', size: '2.4 MB', date: 'Jan 15, 2025' },
      { title: 'Climate Change Adaptation Framework', size: '1.8 MB', date: 'Nov 20, 2024' },
      { title: 'Water Resource Management Act', size: '3.1 MB', date: 'Aug 05, 2023' },
    ]
  },
  {
    title: 'Early Warning Reports',
    icon: AlertCircle,
    description: 'Monthly and quarterly multi-hazard situational reports.',
    items: [
      { title: 'Q1 2026 Multi-Hazard Bulletin', size: '4.5 MB', date: 'Mar 01, 2026' },
      { title: 'February 2026 Drought Assessment', size: '1.2 MB', date: 'Feb 28, 2026' },
      { title: 'El Niño Impact Summary Report', size: '3.7 MB', date: 'Dec 10, 2025' },
    ]
  },
  {
    title: 'Maps & Spatial Data',
    icon: MapIcon,
    description: 'High-resolution thematic maps and vulnerability shapefile exports.',
    items: [
      { title: 'Uganda River Basins Map (High-Res)', size: '8.5 MB', date: 'Feb 10, 2026' },
      { title: 'Karamoja Drought Vulnerability Map', size: '6.2 MB', date: 'Jan 25, 2026' },
      { title: 'Weather Station Coverage Atlas', size: '5.4 MB', date: 'Nov 12, 2025' },
    ]
  }
];

export default function ResourcesPage({ isDarkMode = true }: ResourcesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const cardBg = isDarkMode ? 'bg-slate-800/85' : 'bg-white/95';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const borderColor = isDarkMode ? 'border-slate-700/50' : 'border-slate-200';

  const filteredCategories = resourceCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div 
          className="relative overflow-hidden rounded-xl p-6 md:p-8 animate-fade-in-up"
          style={{ background: `linear-gradient(135deg, ${FAO_BLUE}e6 0%, ${FAO_BLUE}99 100%)` }}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
             <BookOpen className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Resource Center</h1>
              <p className="text-slate-100 max-w-xl text-sm md:text-base leading-relaxed">
                Access and download essential policy documents, analytical reports, high-resolution maps, and multi-hazard assessment materials.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full md:w-72 mt-2 md:mt-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-300" />
              </div>
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white/20 hover:bg-white/30 focus:bg-white text-white focus:text-slate-900 placeholder-slate-200 focus:placeholder-slate-400 outline-none rounded-lg border border-white/30 focus:border-white transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        {/* Categories & Files */}
        <div className="space-y-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => {
              const CategoryIcon = category.icon;
              return (
                <div key={idx} className={`${cardBg} backdrop-blur-sm border ${borderColor} rounded-xl shadow-sm overflow-hidden animate-fade-in-up`} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className={`p-4 md:p-5 border-b ${borderColor} flex items-center gap-3`} style={{ backgroundColor: isDarkMode ? 'rgba(49, 141, 222, 0.05)' : 'rgba(49, 141, 222, 0.03)' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: isDarkMode ? `${FAO_BLUE}30` : 'white', border: isDarkMode ? `1px solid ${FAO_BLUE}40` : `1px solid ${FAO_BLUE}20` }}>
                      <CategoryIcon className="w-5 h-5" style={{ color: FAO_BLUE }} />
                    </div>
                    <div>
                      <h2 className={`text-base md:text-lg font-bold ${headerText}`}>{category.title}</h2>
                      <p className={`text-xs ${textMuted}`}>{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="divide-y" style={{ borderColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : '#e2e8f0' }}>
                    {category.items.map((file, fIdx) => (
                      <div key={fIdx} className={`p-4 flex items-center justify-between group transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-slate-700/50 text-slate-400' : 'bg-slate-100 text-slate-500'} group-hover:text-blue-500 transition-colors`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className={`text-sm font-semibold ${headerText} group-hover:text-blue-500 transition-colors`}>{file.title}</h3>
                            <div className={`flex items-center gap-3 mt-0.5 text-[11px] ${textMuted}`}>
                              <span>PDF Document</span>
                              <span className="w-1 h-1 rounded-full bg-slate-400/50" />
                              <span>{file.size}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-400/50" />
                              <span>Updated: {file.date}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all ${isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white' : 'border-slate-200 text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900'} hover:border-blue-400 group-hover:-translate-y-0.5`}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`py-16 text-center border-2 border-dashed rounded-xl ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <BookOpen className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
              <h3 className={`text-lg font-semibold ${headerText} mb-1`}>No resources found</h3>
              <p className={textMuted}>Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
