import React, { useState } from 'react';
import { VisaRoute, UserProfile } from '../types';
import { analyzeEligibility } from '../services/geminiService';

interface AssessmentFormProps {
  onComplete: (res: any, prof: UserProfile) => void;
  onCancel: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    route: VisaRoute.TECH,
    careerStage: 'Exceptional Talent',
    currentRole: '',
    summary: '',
    evidenceItems: []
  });

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
      onComplete(result, formData as UserProfile);
    } catch (error) {
      console.error(error);
      alert('Assessment failed. Check your connection.');
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
    <div className="h-full flex flex-col px-6 py-4 animate-fade-in overflow-hidden">
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
              <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Impact Statement</label>
              <textarea 
                className="w-full p-6 rounded-3xl border border-gray-100 bg-[#FAFAFA] text-sm font-medium outline-none h-40 resize-none focus:ring-1 focus:ring-black/5"
                placeholder="Key achievements and global impact..."
                value={formData.summary}
                onChange={e => setFormData({...formData, summary: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 opacity-60">
                <i className="fa-solid fa-paperclip text-gray-400"></i>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Optional Evidence Attachments</span>
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
            {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : 'Audit Profile'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentForm;