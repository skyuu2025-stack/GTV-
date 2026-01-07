
import React, { useState, useEffect } from 'react';
import { VisaRoute, UserProfile } from '../types';
import { analyzeEligibility } from '../services/geminiService';

interface AssessmentFormProps {
  onComplete: (res: any, prof: UserProfile) => void;
  onCancel: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    route: VisaRoute.TECH,
    careerStage: 'Exceptional Talent',
    currentRole: '',
    summary: '',
    evidenceItems: []
  });

  const loadingMessages = [
    "Connecting to UK VI framework...",
    "Analyzing endorsement criteria...",
    "Parsing career impact data...",
    "Evaluating evidence readiness...",
    "Generating professional roadmap..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || (step === 3 && !formData.summary)) {
        alert('Please complete all required fields.');
        return;
    }
    setLoading(true);
    try {
      const result = await analyzeEligibility(formData as UserProfile);
      // Artificial delay for premium feel if AI is too fast
      await new Promise(resolve => setTimeout(resolve, 2000));
      onComplete(result, formData as UserProfile);
    } catch (error) {
      console.error(error);
      alert('Assessment failed. Check your connection or API key.');
    } finally {
      setLoading(false);
    }
  };

  const stepsMetadata = [
    { title: 'Identity', sub: 'PROFILE' },
    { title: 'Route', sub: 'FRAMEWORK' },
    { title: 'Impact', sub: 'AUDIT' }
  ];

  return (
    <div className="h-full flex flex-col px-6 py-4 animate-fade-in overflow-hidden relative">
      {/* Premium Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin mb-8"></div>
          <div className="space-y-2">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400 animate-pulse">
              {loadingMessages[loadingStep]}
            </p>
            <h3 className="text-xl font-black italic uppercase tracking-tighter">AI Audit in Progress</h3>
          </div>
          <p className="mt-12 text-[8px] font-medium text-gray-400 uppercase tracking-widest">Powered by Gemini 2.5 Pro Vision Engine</p>
        </div>
      )}

      {/* Header Info */}
      <div className="flex justify-between items-end mb-6">
        <div>
           <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{stepsMetadata[step - 1].title}</h2>
           <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-1">Step {step}/3 • {stepsMetadata[step - 1].sub}</p>
        </div>
        <div className="flex gap-1.5 pb-1">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-1 w-6 rounded-full ${step >= i ? 'bg-black' : 'bg-gray-100'}`} />
          ))}
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-grow flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Legal Name</label>
              <input 
                type="text" 
                autoFocus
                className="w-full text-xl font-bold border-b border-gray-100 pb-3 focus:border-black outline-none transition-all placeholder-gray-200 bg-transparent"
                placeholder="Candidate Name"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
              <input 
                type="email" 
                className="w-full text-xl font-bold border-b border-gray-100 pb-3 focus:border-black outline-none transition-all placeholder-gray-200 bg-transparent"
                placeholder="Professional Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Endorsement Body</label>
              <select 
                className="w-full px-5 py-5 rounded-2xl border border-gray-100 bg-[#FAFAFA] text-base font-bold outline-none cursor-pointer focus:ring-1 focus:ring-black/5"
                value={formData.route}
                onChange={e => setFormData({...formData, route: e.target.value as VisaRoute})}
              >
                {Object.values(VisaRoute).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Experience Stage</label>
              <select 
                className="w-full px-5 py-5 rounded-2xl border border-gray-100 bg-[#FAFAFA] text-base font-bold outline-none cursor-pointer focus:ring-1 focus:ring-black/5"
                value={formData.careerStage}
                onChange={e => setFormData({...formData, careerStage: e.target.value as any})}
              >
                <option value="Exceptional Talent">Talent (Leader)</option>
                <option value="Exceptional Promise">Promise (Rising Star)</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Professional Role</label>
              <input 
                type="text" 
                className="w-full text-lg font-bold border-b border-gray-100 pb-3 focus:border-black outline-none transition-all placeholder-gray-200 bg-transparent"
                placeholder="e.g. Senior Software Engineer"
                value={formData.currentRole}
                onChange={e => setFormData({...formData, currentRole: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Impact Summary</label>
              <textarea 
                className="w-full p-6 rounded-3xl border border-gray-100 bg-[#FAFAFA] text-sm font-medium outline-none h-32 resize-none focus:ring-1 focus:ring-black/5"
                placeholder="Key achievements and global impact..."
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex gap-3 pb-4">
        {step > 1 && (
          <button 
            onClick={prevStep}
            className="w-16 h-16 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 active:scale-95 transition-all shadow-sm bg-white"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        {step < 3 ? (
          <button 
            onClick={nextStep}
            className="flex-grow bg-[#111111] text-white py-4 rounded-2xl font-black italic tracking-widest uppercase active:scale-[0.98] transition-all shadow-lg text-sm"
          >
            Next
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex-grow bg-[#111111] text-white py-4 rounded-2xl font-black italic tracking-widest uppercase shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Run Global Audit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;
