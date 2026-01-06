import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AssessmentResult, UserProfile } from '../types';

interface ResultsViewProps {
  results: AssessmentResult;
  profile: UserProfile;
  onRestart: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, profile, onRestart }) => {
  const chartData = [
    { subject: 'Profile', A: results.score },
    { subject: 'Impact', A: results.score - 5 },
    { subject: 'Leader', A: profile.careerStage === 'Exceptional Talent' ? 90 : 65 },
    { subject: 'Innovation', A: 75 },
    { subject: 'Evidence', A: Math.min(100, (profile.summary.length / 5)) },
  ];

  const getStatusColor = (prob: string) => {
    const p = prob.toLowerCase();
    if (p === 'high') return 'text-[#059669]';
    if (p === 'medium') return 'text-[#D97706]';
    return 'text-[#DC2626]';
  };

  return (
    <div className="h-full flex flex-col px-6 py-4 animate-fade-in overflow-hidden">
      {/* Top Header - Fixed */}
      <div className="text-center mb-4">
         <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-1">Success Probability</span>
         <div className={`text-6xl font-black italic tracking-tighter leading-none ${getStatusColor(results.probability)}`}>
            {results.probability}
         </div>
      </div>

      {/* Internal Scrollable Content - specifically for the report details */}
      <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
        {/* Radar Chart Section */}
        <div className="bg-gray-50/50 rounded-[32px] p-4 h-48 border border-gray-50 flex flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 8, fontWeight: 700 }} />
                <Radar name="Candidate" dataKey="A" stroke="#1A1A1A" fill="#F59E0B" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
        </div>

        {/* Action Items */}
        <div className="space-y-3">
            <div className="bg-[#F0FDF4] p-5 rounded-[24px] border border-[#DCFCE7]">
              <div className="text-[8px] font-black uppercase tracking-widest text-[#15803D] mb-3">Key Strengths</div>
              <ul className="space-y-2">
                {results.strengths.slice(0, 2).map((s, i) => (
                  <li key={i} className="text-[10px] font-bold text-[#166534] flex gap-2">
                    <span className="opacity-30">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#111111] p-6 rounded-[32px] text-white shadow-xl">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="text-xs font-black italic uppercase tracking-widest">Roadmap</h4>
                 <i className="fa-solid fa-map text-[10px] text-[#F59E0B]"></i>
               </div>
               <div className="space-y-4">
                 {results.recommendations.slice(0, 2).map((r, i) => (
                   <div key={i} className="flex gap-3 items-start">
                     <div className="w-4 h-4 rounded-full bg-[#F59E0B] flex-shrink-0 flex items-center justify-center text-[8px] font-black text-black">{i+1}</div>
                     <p className="text-[10px] font-medium text-gray-300 leading-tight">{r}</p>
                   </div>
                 ))}
               </div>
            </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col items-center gap-4 pb-2">
         <button className="w-full bg-black text-white py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all">
            Share Report
         </button>
         <button 
            onClick={onRestart}
            className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400"
         >
            Back to Home
         </button>
      </div>
    </div>
  );
};

export default ResultsView;