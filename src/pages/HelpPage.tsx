import { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Mail, 
  MessageCircle, 
  FileText
} from 'lucide-react';

interface HelpPageProps {
  isDarkMode?: boolean;
}

const FAO_BLUE = '#318DDE';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is the Uganda Multi-Hazard Observatory System?',
        a: 'The Uganda Multi-Hazard Observatory System is a comprehensive monitoring platform developed in partnership with FAO to provide real-time data and early warnings for various environmental hazards, including drought, floods, and weather extremes across Uganda.'
      },
      {
        q: 'Who can access this data?',
        a: 'The system is designed for use by government agencies, disaster management teams, agricultural extension workers, and the general public to aid in informed decision-making and disaster risk reduction.'
      }
    ]
  },
  {
    category: 'Weather & Forecasts',
    questions: [
      {
        q: 'How accurate are the weather forecasts?',
        a: 'Our 24-hour nowcasts use high-resolution satellite and station data with approximately 87% accuracy. 7-day forecasts are updated every 6 hours to provide the most current predictions.'
      },
      {
        q: 'What is a "Nowcast"?',
        a: 'A nowcast is a very short-term weather forecast (usually for the next few hours) that describes the current weather and how it is expected to change in the immediate future.'
      }
    ]
  },
  {
    category: 'Drought Monitoring (CDI)',
    questions: [
      {
        q: 'What is the Combined Drought Index (CDI)?',
        a: 'The CDI is a composite indicator used to identify areas at risk of drought. It integrates data from rainfall, soil moisture, and vegetation health to provide a holistic view of drought conditions.'
      },
      {
        q: 'How often is the drought data updated?',
        a: 'CDI maps and drought indicators are updated on a monthly basis, with weekly updates for specific vegetation health indices.'
      }
    ]
  },
  {
    category: 'Flood Monitoring',
    questions: [
      {
        q: 'How are river basin levels monitored?',
        a: 'We use a combination of physical sensors at weather stations and satellite telemetry to monitor water levels in major river basins across Uganda.'
      },
      {
        q: 'What do the flood alert levels mean?',
        a: 'Alerts are categorized into: Normal (No risk), Minor (Potential for localized issues), Moderate (Warning, preparation advised), and Severe (High risk of flooding, immediate action required).'
      }
    ]
  }
];

export default function HelpPage({ isDarkMode = true }: HelpPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<string | null>('0-0');

  const toggleFAQ = (id: string) => {
    setExpandedIndex(expandedIndex === id ? null : id);
  };

  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const headerText = isDarkMode ? 'text-white' : 'text-slate-900';
  const cardBg = isDarkMode ? 'bg-slate-800/50' : 'bg-white';
  const borderColor = isDarkMode ? 'border-slate-700' : 'border-slate-200';

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="relative z-10 max-w-[1000px] mx-auto">
        {/* Header Ribbon */}
        <div 
          className="relative overflow-hidden rounded-lg md:rounded-xl p-6 md:p-8 mb-6 text-center animate-fade-in-up"
          style={{ background: `linear-gradient(135deg, ${FAO_BLUE}e6 0%, ${FAO_BLUE}99 100%)` }}
        >
          <div className="relative z-10">
            <HelpCircle className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">How can we help you?</h1>
            <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-6">
              Search our knowledge base or browse frequently asked questions to find the information you need.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: 'User Guide', link: '#' },
            { icon: FileText, label: 'Documentation', link: '#' },
            { icon: Mail, label: 'Contact Support', link: '#' },
            { icon: MessageCircle, label: 'Feedback', link: '#' },
          ].map((item, i) => (
            <a 
              key={i}
              href={item.link}
              className={`${cardBg} ${borderColor} border rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all group`}
            >
              <item.icon className="w-6 h-6" style={{ color: FAO_BLUE }} />
              <span className={`text-xs font-medium ${headerText}`}>{item.label}</span>
            </a>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className={`text-xl font-bold ${headerText} mb-4`}>Frequently Asked Questions</h2>
          
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((category, catIdx) => (
              <div key={category.category} className="space-y-3">
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${textMuted}`}>{category.category}</h3>
                <div className="space-y-2">
                  {category.questions.map((item, qIdx) => {
                    const id = `${catIdx}-${qIdx}`;
                    const isExpanded = expandedIndex === id;
                    return (
                      <div 
                        key={id}
                        className={`${cardBg} ${borderColor} border rounded-xl overflow-hidden transition-all`}
                      >
                        <button 
                          onClick={() => toggleFAQ(id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/5 transition-colors"
                        >
                          <span className={`text-sm font-medium ${headerText}`}>{item.q}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 animate-fade-in">
                            <p className={`text-sm leading-relaxed ${textMuted}`}>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className={textMuted}>No results found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center pb-8">
          <p className={`text-sm ${textMuted}`}>
            Still need help? <a href="#" className="font-medium hover:underline" style={{ color: FAO_BLUE }}>Contact our technical team</a>
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
            <span className="text-[10px] uppercase tracking-widest font-bold">Uganda Multi-Hazard Observatory</span>
            <span className="w-1 h-1 rounded-full bg-slate-500"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold">FAO partnership</span>
          </div>
        </div>
      </div>
    </div>
  );
}
