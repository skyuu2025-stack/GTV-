import React, { useState, useMemo, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { AssessmentResult, UserProfile } from '../types.ts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResultsViewProps {
  results: AssessmentResult;
  profile: UserProfile;
  isPaid: boolean;
  onRestart: () => void;
  onUpgrade: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, profile, isPaid, onRestart, onUpgrade }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'geo'>('audit');
  const reportRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => [
    { subject: 'Readiness', A: results.score || 0 },
    { subject: 'GEO Rank', A: results.geoAudit?.visibilityScore || 50 },
    { subject: 'Leader', A: profile.careerStage === 'Exceptional Talent' ? 90 : 65 },
    { subject: 'Discovery', A: profile.publicUrl ? 85 : 30 },
    { subject: 'Impact', A: results.score > 70 ? 80 : 60 },
  ], [results.score, results.geoAudit, profile]);

  const reportId = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  const handleDownloadPDF = async () => {
    if (!isPaid || !reportRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GTV_Audit_${reportId}.pdf`);
    } catch (err) {
      alert('PDF Generation Error.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCopyResults = async () => {
    const summary = `UK GTV AI AUDIT #${reportId}\nScore: ${results.score}/100\nGEO: ${results.geoAudit?.visibilityScore}%`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const getStatusColor = (prob: string) => {
    const p = (prob || '').toLowerCase();
    if (p === 'high') return 'text-[#059669]';
    if (p === 'medium') return 'text-[#D97706]';
    return 'text-[#DC2626]';
  };

  return (
    <div className="h-full flex flex-col animate-fade-in bg-white overflow-hidden pb-[calc(var(--sab)+5rem)]">
      <div className="flex-grow flex flex-col px-6 py-4 overflow-hidden">
        
        <div className="flex justify-between items-center mb-6 shrink-0 pt-2">
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 block mb-1">Audit Ref: #{reportId}</span>
              <div className={`text-4xl font-black italic tracking-tighter leading-none ${getStatusColor(results.probability)}`}>
                  {results.probability || 'N/A'}
              </div>
            </div>
            
            <div className="flex gap-1.5 p-1 bg-gray-50 rounded-2xl">
              <button 
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'audit' ? 'bg-black text-white shadow-lg' : 'text-gray-400'}`}
              >
                Audit
              </button>
              <button 
                onClick={() => setActiveTab('geo')}
                className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === 'geo' ? 'bg-[#F59E0B] text-black shadow-lg' : 'text-gray-400'}`}
              >
                GEO
              </button>
            </div>
        </div>

        <div ref={reportRef} className="flex-grow flex flex-col overflow-y-auto no-scrollbar space-y-4 pb-4">
          {activeTab === 'audit' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black text-white p-6 rounded-[2.5rem] flex flex-col justify-between h-40">
                   <div className="text-[8px] font-black uppercase tracking-widest opacity-40">Ready Score</div>
                   <div className="text-5xl font-black italic">{results.score}</div>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2.5rem] flex flex-col justify-between h-40 border border-gray-100">
                   <div className="text-[8px] font-black uppercase tracking-widest text-gray-400">Framework</div>
                   <div className="text-[11px] font-black uppercase text-black leading-tight">{profile.route.split('(')[0]}</div>
                </div>
              </div>

              <div className="bg-[#111111] p-8 rounded-[3rem] text-white shadow-2xl">
                <h4 className="text-[9px] font-black italic uppercase tracking-[0.4em] text-[#F59E0B] mb-8 underline underline-offset-8">Endorsement Strategy</h4>
                <div className="space-y-8">
                  {(results.recommendations || []).map((rec, i) => {
                    const isLocked = !isPaid && i > 0;
                    return (
                      <div key={i} className={`flex gap-6 ${isLocked ? 'opacity-20 blur-sm' : ''}`}>
                        <div className="text-xs font-black text-gray-600">0{i+1}</div>
                        <div className="space-y-2">
                           <h5 className="text-xs font-black uppercase text-white leading-none tracking-tight">{rec.title}</h5>
                           {!isLocked && <p className="text-[10px] text-gray-400 leading-normal font-medium">{rec.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-[#FFFBEB] p-8 rounded-[3rem] border border-[#F59E0B]/20">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#F59E0B]">AI Discovery Score</h3>
                    <div className="text-5xl font-black italic text-black">{results.geoAudit?.visibilityScore || 0}%</div>
                  </div>
                  <div className="w-12 h-12 bg-black text-[#F59E0B] rounded-2xl flex items-center justify-center shadow-xl">
                    <i className="fa-solid fa-sparkles"></i>
                  </div>
                </div>

                {!isPaid ? (
                  <button onClick={onUpgrade} className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Unlock GEO Profile</button>
                ) : (
                  <div className="space-y-6">
                    <div className="p-5 bg-white/60 rounded-3xl border border-[#F59E0B]/10">
                      <div className="text-[8px] font-black uppercase tracking-widest text-[#F59E0B] mb-2">Machine Identification</div>
                      <p className="text-xs font-bold text-black leading-tight italic">"{results.geoAudit?.aiPersona}"</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-64 bg-gray-50 rounded-[3rem] p-6 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 900 }} />
                    <Radar dataKey="A" stroke="#000000" strokeWidth={3} fill="#F59E0B" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-gray-50 z-40 pb-[calc(var(--sab)+1rem)] max-w-lg mx-auto w-full flex flex-col gap-2">
         {!isPaid && (
            <button onClick={onUpgrade} className="w-full bg-[#111111] text-white h-16 rounded-[2rem] font-black italic uppercase tracking-widest text-[11px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
               <i className="fa-solid fa-crown text-[#F59E0B]"></i>
               Access Full Expert Report
            </button>
         )}
         <div className="flex gap-2">
            <button onClick={onRestart} className="flex-1 bg-gray-50 border border-gray-100 text-gray-400 h-14 rounded-[1.5rem] font-black italic uppercase tracking-widest text-[10px] active:scale-95">Reset</button>
            <button onClick={handleCopyResults} className={`flex-1 h-14 rounded-[1.5rem] font-black italic uppercase tracking-widest text-[10px] transition-all border ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-black text-black'}`}>
               {copied ? 'Success' : 'Copy'}
            </button>
            {isPaid && (
              <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="w-14 h-14 bg-[#F59E0B] text-black rounded-[1.5rem] flex items-center justify-center shadow-lg active:scale-95 transition-all">
                {isGeneratingPDF ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-file-pdf"></i>}
              </button>
            )}
         </div>
      </div>
    </div>
  );
};

export default ResultsView;