
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
    { subject: 'Readiness', A: results.score },
    { subject: 'Impact', A: results.score - 5 },
    { subject: 'Leader', A: profile.careerStage === 'Exceptional Talent' ? 90 : 65 },
    { subject: 'Innovation', A: 75 },
    { subject: 'Proof', A: Math.min(100, (profile.summary.length / 4)) },
  ];

  const getStatusColor = (prob: string) => {
    const p = prob.toLowerCase();
    if (p === 'high') return 'text-[#059669]';
    if (p === 'medium') return 'text-[#D97706]';
    return 'text-[#DC2626]';
  };

  const handleShare = async () => {
    const shareData = {
      title: 'GTV AI Audit Report',
      text: `My UK Global Talent Visa eligibility is ${results.probability} according to GTV Assessor.`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Sharing failed', err);
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Report link copied to clipboard.');
    }
  };

  const reportId = Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="h-full flex flex-col px-6 py-4 animate-fade-in overflow-hidden">
      {/* Top Header - Fixed */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-left">
           <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-300 block mb-1">Audit Ref: #{reportId}</span>
           <div className={`text-5xl font-black italic tracking-tighter leading-none ${getStatusColor(results.probability)}`}>
              {results.probability}
           </div>
           <span className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-400">Success Probability</span>
        </div>
        <div className="bg-black text-white px-3 py-1 rounded-full text-[8px] font-black tracking-widest uppercase">
          {profile.careerStage === 'Exceptional Talent' ? 'Talent' : 'Promise'}
        </div>
      </div>

      {/* Internal Scrollable Content */}
      <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
        {/* Radar Chart Section */}
        <div className="bg-[#FAFAFA] rounded-[32px] p-6 h-56 border border-gray-100 flex flex-shrink-0 relative overflow-hidden">
            <div className="absolute top-4 left-6 text-[8px] font-black text-gray-200 uppercase tracking-widest">Competency Matrix</div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                <PolarGrid stroke="#F3F4F6" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 7, fontWeight: 800 }} />
                <Radar name="Candidate" dataKey="A" stroke="#1A1A1A" fill="#F59E0B" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F0FDF4] p-4 rounded-3xl border border-[#DCFCE7]">
                <div className="text-[7px] font-black uppercase tracking-widest text-[#15803D] mb-2">Strengths</div>
                <div className="text-[9px] font-bold text-[#166534] leading-tight">
                  {results.strengths[0]}
                </div>
              </div>
              <div className="bg-[#FEF2F2] p-4 rounded-3xl border border-[#FEE2E2]">
                <div className="text-[7px] font-black uppercase tracking-widest text-[#B91C1C] mb-2">Primary Gap</div>
                <div className="text-[9px] font-bold text-[#991B1B] leading-tight">
                  {results.weaknesses[0]}
                </div>
              </div>
            </div>

            <div className="bg-[#111111] p-6 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl"></div>
               <div className="flex justify-between items-center mb-4 relative">
                 <h4 className="text-[9px] font-black italic uppercase tracking-[0.2em] text-gray-400">Roadmap Strategy</h4>
                 <i className="fa-solid fa-arrow-trend-up text-[10px] text-[#F59E0B]"></i>
               </div>
               <div className="space-y-4 relative">
                 {results.recommendations.slice(0, 3).map((r, i) => (
                   <div key={i} className="flex gap-4 items-start border-l border-white/10 pl-4">
                     <div className="text-[9px] font-black text-[#F59E0B] py-0.5">0{i+1}</div>
                     <p className="text-[10px] font-medium text-gray-300 leading-snug">{r}</p>
                   </div>
                 ))}
               </div>
            </div>

            <div className="p-5 border border-gray-100 rounded-3xl space-y-3">
               <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">Suggested Evidence</div>
               <div className="flex flex-wrap gap-2">
                 {results.suggestedEvidence.slice(0, 4).map((item, i) => (
                   <span key={i} className="px-2 py-1 bg-gray-50 text-[8px] font-bold text-gray-500 rounded-lg uppercase tracking-tight border border-gray-100">
                     {item}
                   </span>
                 ))}
               </div>
            </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="mt-6 pt-4 border-t border-gray-50 flex flex-col items-center gap-3 pb-2">
         <button 
            onClick={handleShare}
            className="w-full bg-black text-white py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
         >
            <i className="fa-solid fa-paper-plane text-[10px]"></i>
            Export Audit
         </button>
         <button 
            onClick={onRestart}
            className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-colors"
         >
            Restart Evaluation
         </button>
      </div>
    </div>
  );
};

export default ResultsView;
