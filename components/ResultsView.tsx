import React, { useState, useMemo, useRef } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AssessmentResult, UserProfile, InsightPoint } from '../types.ts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ResultsViewProps {
  results: AssessmentResult;
  profile: UserProfile;
  isPaid: boolean;
  onRestart: () => void;
  onUpgrade: () => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111111] text-[#F59E0B] px-4 py-3 rounded-2xl border border-[#F59E0B]/40 shadow-2xl animate-fade-in ring-4 ring-[#F59E0B]/5">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-50 mb-1">{payload[0].payload.subject}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-lg font-black italic">{payload[0].value}</p>
          <span className="text-[10px] opacity-40">/100</span>
        </div>
      </div>
    );
  }
  return null;
};

const InsightTooltip = ({ title, description, type, isLocked }: { title: string; description: string; type: 'strength' | 'weakness'; isLocked?: boolean }) => {
  if (isLocked) return null;
  const bgColor = type === 'strength' ? 'border-[#22C55E]/40' : 'border-[#EF4444]/40';
  const labelColor = type === 'strength' ? 'text-[#22C55E]' : 'text-[#EF4444]';
  
  return (
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-[#111111] ${bgColor} border rounded-2xl shadow-2xl backdrop-blur-xl z-[60] animate-fade-in pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity`}>
      <div className={`text-[7px] font-black uppercase tracking-[0.2em] ${labelColor} mb-1`}>{type === 'strength' ? 'Asset Context' : 'Risk Analysis'}</div>
      <div className="text-[10px] font-black italic text-white mb-2 leading-none uppercase">{title}</div>
      <div className="text-[9px] font-medium text-gray-400 leading-tight">{description}</div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111111] rotate-45 -mt-1 border-r border-b border-inherit"></div>
    </div>
  );
};

const ResultsView: React.FC<ResultsViewProps> = ({ results, profile, isPaid, onRestart, onUpgrade }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const chartData = useMemo(() => [
    { subject: 'Readiness', A: results.score || 0 },
    { subject: 'Impact', A: Math.max(0, (results.score || 0) - 5) },
    { subject: 'Leader', A: profile.careerStage === 'Exceptional Talent' ? 90 : 65 },
    { subject: 'Innovation', A: 75 },
    { subject: 'Proof', A: Math.min(100, ((profile.summary?.length || 0) / 4)) },
  ], [results.score, profile.careerStage, profile.summary]);

  const reportId = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  const handleDownloadPDF = async () => {
    if (!isPaid) return;
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GTV_Audit_Report_${reportId}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Failed to generate PDF.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleCopyResults = async () => {
    const header = `UK GLOBAL TALENT VISA - AI AUDIT REPORT 2026\nAudit Reference: #${reportId}\nCandidate: ${profile.fullName}\nEndorsement Probability: ${results.probability.toUpperCase()}\nBasic Score: ${results.score}/100\n\n`;
    const body = isPaid ? `
[KEY STRENGTHS]
${(results.strengths || []).map(s => `• ${s.title}: ${s.description}`).join('\n')}

[PRIMARY GAPS / WEAKNESSES]
${(results.weaknesses || []).map(w => `• ${w.title}: ${w.description}`).join('\n')}

[STRATEGIC RECOMMENDATIONS]
${(results.recommendations || []).map(r => `• ${r.title}: ${r.action}`).join('\n')}
` : `
[FREE BASIC RESULT]
Score: ${results.score}/100
Primary Strength: ${results.strengths?.[0]?.title}

Note: Detailed gap analysis and roadmap steps are locked. Upgrade to Expert Audit to see full strategic recommendations.
`.trim();

    try {
      await navigator.clipboard.writeText(header + body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy results:', err);
    }
  };

  const getStatusColor = (prob: string) => {
    const p = (prob || '').toLowerCase();
    if (p === 'high') return 'text-[#059669]';
    if (p === 'medium') return 'text-[#D97706]';
    return 'text-[#DC2626]';
  };

  const primaryStrength = results.strengths?.[0] || { title: 'Core Profile', description: 'Your initial profile data indicates a valid foundation for the selected route.' };
  const primaryWeakness = results.weaknesses?.[0] || { title: 'Evidence Depth', description: 'Significant gaps detected in evidentiary quality for high-impact endorsements.' };

  return (
    <div className="h-full flex flex-col lg:flex-row animate-fade-in overflow-hidden bg-white relative">
      {/* Zoom Modal Overlay */}
      {isZoomed && isPaid && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-6 animate-fade-in">
          <button onClick={() => setIsZoomed(false)} className="absolute top-8 right-8 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-xl active:scale-90 transition-transform">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className="w-full max-w-2xl aspect-square flex flex-col items-center">
            <h2 className="text-[#F59E0B] text-[10px] font-black uppercase tracking-[0.5em] mb-12">Enhanced Competency Analysis</h2>
            <div className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 12, fontWeight: 900 }} />
                  <Radar name="Candidate" dataKey="A" stroke="#F59E0B" strokeWidth={3} fill="#F59E0B" fillOpacity={0.2} isAnimationActive={true} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F59E0B', strokeWidth: 1 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="flex-grow flex flex-col px-6 py-4 overflow-hidden lg:border-r border-gray-50">
        <div ref={reportRef} className="flex-grow flex flex-col overflow-y-auto no-scrollbar space-y-4 pb-4 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start mb-4 shrink-0 pt-2">
            <div className="text-left">
              <span className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-300 block mb-1">Audit Ref: #{reportId}</span>
              <div className={`text-5xl font-black italic tracking-tighter leading-[0.8] ${getStatusColor(results.probability)}`}>
                  {results.probability || 'N/A'}
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.1em] text-gray-400 mt-1 block">Endorsement Prob.</span>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              {!isPaid ? (
                <div className="bg-[#F0F9FF] border border-[#E0F2FE] px-3 py-1.5 rounded-full flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-[#0284C7] rounded-full animate-pulse"></div>
                   <span className="text-[7px] font-black uppercase tracking-widest text-[#0284C7]">Basic Assessment</span>
                </div>
              ) : (
                <div className="bg-[#FFFBEB] border border-[#FEF3C7] px-3 py-1.5 rounded-full flex items-center gap-2">
                   <i className="fa-solid fa-crown text-[#F59E0B] text-[8px]"></i>
                   <span className="text-[7px] font-black uppercase tracking-widest text-[#F59E0B]">Expert Audit</span>
                </div>
              )}
              <div className="bg-black text-white px-3 py-1 rounded-full text-[7px] font-black tracking-widest uppercase">
                {profile.careerStage === 'Exceptional Talent' ? 'Talent' : 'Promise'}
              </div>
            </div>
          </div>

          {/* Radar Chart Section (Locked if Free) */}
          <div className="lg:hidden shrink-0 h-44 w-full mb-4 bg-gray-50/50 rounded-3xl border border-gray-50 p-2 overflow-hidden relative">
              {!isPaid && (
                <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/40 flex flex-col items-center justify-center p-4 text-center">
                   <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                      <i className="fa-solid fa-lock text-black text-[10px]"></i>
                   </div>
                   <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-2">Competency Radar Locked</p>
                   <button onClick={onUpgrade} className="text-[8px] font-black uppercase tracking-[0.2em] text-black border-b border-black">Upgrade to Expert</button>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 7, fontWeight: 800 }} />
                      <Radar name="Candidate" dataKey="A" stroke="#1A1A1A" strokeWidth={2} fill="#F59E0B" fillOpacity={0.15} />
                  </RadarChart>
              </ResponsiveContainer>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="group relative bg-[#F0FDF4] p-4 rounded-2xl border border-[#DCFCE7] transition-all hover:bg-[#DCFCE7] cursor-help">
              <InsightTooltip title={primaryStrength.title} description={primaryStrength.description} type="strength" isLocked={!isPaid} />
              <div className="text-[6px] font-black uppercase tracking-widest text-[#15803D] mb-1">Key Asset {isPaid && <i className="fa-solid fa-circle-info opacity-30 ml-1"></i>}</div>
              <div className="text-[9px] font-bold text-[#166534] leading-tight italic truncate">
                {primaryStrength.title}
              </div>
              <p className="text-[8px] text-[#166534]/70 mt-1 line-clamp-1">{primaryStrength.description}</p>
            </div>

            <div className="group relative bg-[#FEF2F2] p-4 rounded-2xl border border-[#FEE2E2] transition-all hover:bg-[#FEE2E2] cursor-help">
              <InsightTooltip title={primaryWeakness.title} description={primaryWeakness.description} type="weakness" isLocked={!isPaid} />
              <div className="text-[6px] font-black uppercase tracking-widest text-[#B91C1C] mb-1">Critical Gap {isPaid && <i className="fa-solid fa-circle-info opacity-30 ml-1"></i>}</div>
              <div className={`text-[9px] font-bold text-[#991B1B] leading-tight italic truncate ${!isPaid ? 'blur-[3px]' : ''}`}>
                {primaryWeakness.title}
              </div>
              {!isPaid && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <button onClick={onUpgrade} className="text-[7px] font-black uppercase tracking-widest text-[#B91C1C] flex items-center gap-1">
                       <i className="fa-solid fa-lock text-[6px]"></i> Reveal Risk
                    </button>
                 </div>
              )}
            </div>
          </div>

          {/* Roadmap */}
          <div className="relative bg-[#111111] p-5 rounded-[32px] text-white overflow-hidden shadow-2xl min-h-[240px]">
             <div className="flex justify-between items-center mb-6">
               <h4 className="text-[9px] font-black italic uppercase tracking-[0.2em] text-gray-500">2026 Audit Roadmap</h4>
               <div className="text-sm font-black text-[#F59E0B]">
                 {results.score}<span className="text-[8px] opacity-40">/100</span>
               </div>
             </div>
             
             <div className="space-y-6">
               {(results.recommendations || []).map((rec, i) => {
                 const isStepLocked = !isPaid && i > 0;
                 return (
                    <div key={i} className={`flex gap-4 items-start border-l ${isStepLocked ? 'border-white/5 opacity-20' : 'border-white/10'} pl-4 py-1 relative`}>
                      <div className={`text-[8px] font-black ${isStepLocked ? 'text-gray-700' : 'text-[#F59E0B]'} shrink-0`}>0{i+1}</div>
                      <div className={`space-y-1 ${isStepLocked ? 'blur-[4px] select-none' : ''}`}>
                         <h5 className="text-[10px] font-black italic uppercase text-white leading-none">{rec.title}</h5>
                         {!isStepLocked && (
                           <>
                             <p className="text-[9px] text-gray-400 leading-tight">{rec.description}</p>
                             <div className="pt-2">
                                <span className="inline-block bg-[#F59E0B] text-black px-2 py-0.5 rounded-full text-[7px] font-black uppercase italic tracking-wider">Action: {rec.action}</span>
                             </div>
                           </>
                         )}
                         {isStepLocked && <p className="text-[9px] text-gray-500 italic">Upgrade to unlock strategic action...</p>}
                      </div>
                    </div>
                 );
               })}
             </div>

             {!isPaid && (
               <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/90 to-transparent z-20 flex flex-col items-center justify-center px-6 text-center">
                  <button onClick={onUpgrade} className="bg-[#F59E0B] text-black w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <i className="fa-solid fa-bolt-lightning text-[8px]"></i>
                    Get Full Strategic Roadmap
                  </button>
               </div>
             )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-auto pt-4 flex flex-col gap-2 shrink-0 bg-white pb-2 border-t border-gray-50">
           {!isPaid ? (
              <button onClick={onUpgrade} className="w-full bg-[#111111] text-white h-14 rounded-2xl font-black italic uppercase tracking-widest text-[11px] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 mb-1">
                 <i className="fa-solid fa-crown text-[#F59E0B]"></i>
                 Unlock Deep Expert Audit
              </button>
           ) : (
              <button 
                onClick={handleDownloadPDF} 
                disabled={isGeneratingPDF} 
                className={`w-full h-12 bg-[#F59E0B] text-black rounded-2xl font-black uppercase text-[9px] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/10`}
              >
                {isGeneratingPDF ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-file-pdf"></i>}
                Download Expert PDF Report
              </button>
           )}
           
           <div className="flex gap-2">
              <button onClick={onRestart} className="flex-1 bg-[#FAFAFA] border border-gray-100 text-gray-400 h-12 rounded-2xl font-black italic uppercase tracking-widest text-[9px] active:scale-95 transition-transform">
                New Audit
              </button>
              <button 
                onClick={handleCopyResults} 
                className={`flex-1 transition-all duration-300 border h-12 rounded-2xl font-black italic uppercase tracking-widest text-[9px] shadow-sm active:scale-95 flex items-center justify-center gap-2 ${copied ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-black text-black'}`}
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-[10px]`}></i>
                {copied ? 'Copied!' : 'Copy Summary'}
              </button>
           </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-[350px] shrink-0 flex-col p-6 bg-[#FAFAFA] gap-6 relative overflow-hidden">
        {!isPaid && (
          <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
             <div className="bg-black text-white p-10 rounded-[48px] shadow-2xl flex flex-col items-center">
                <div className="w-16 h-16 bg-[#F59E0B] rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl">
                   <i className="fa-solid fa-crown text-black text-3xl"></i>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 leading-none">Deep Analysis Locked</h3>
                <p className="text-[10px] font-bold text-gray-400 mb-10 italic uppercase tracking-widest leading-relaxed">Revealing full competency matrix, evidence source validation, and current 2026 Home Office criteria links.</p>
                <button onClick={onUpgrade} className="w-full bg-[#F59E0B] text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-transform shadow-lg shadow-[#F59E0B]/20">
                  Access Expert Report
                </button>
             </div>
          </div>
        )}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center mb-4">Competency Radar</div>
           <div className="h-48 relative overflow-visible">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#F3F4F6" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 8, fontWeight: 800 }} />
                  <Radar name="Candidate" dataKey="A" stroke="#1A1A1A" strokeWidth={2} fill="#F59E0B" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col gap-4 overflow-y-auto no-scrollbar">
           <h5 className="text-[8px] font-black uppercase tracking-widest text-gray-400">Detailed Insights</h5>
           <div className="space-y-4">
              {results.strengths.slice(0, isPaid ? 5 : 1).map((s, idx) => (
                <div key={`s-${idx}`} className="group relative p-4 bg-[#F0FDF4] rounded-2xl border border-[#DCFCE7] cursor-help">
                   <div className="text-[9px] font-black text-[#15803D] uppercase leading-none mb-1">{s.title}</div>
                   <div className="text-[8px] text-[#166534] opacity-70 leading-tight">{s.description}</div>
                   <InsightTooltip title={s.title} description={s.description} type="strength" isLocked={!isPaid} />
                </div>
              ))}
              {!isPaid && (
                 <div className="p-4 border border-dashed border-gray-200 rounded-2xl flex items-center justify-center">
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Additional Analysis Locked</span>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;