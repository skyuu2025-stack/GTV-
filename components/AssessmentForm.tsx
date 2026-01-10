import React, { useState, useEffect, useRef } from 'react';
import { VisaRoute, UserProfile, AssessmentRecord } from '../types.ts';
import { analyzeEligibility } from '../services/geminiService.ts';

interface AssessmentFormProps {
  onComplete: (res: any, prof: UserProfile) => void;
  onCancel: () => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentTextEvidence, setCurrentTextEvidence] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});
  const [touched, setTouched] = useState<{ fullName?: boolean; email?: boolean }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    route: VisaRoute.TECH,
    careerStage: 'Exceptional Talent',
    currentRole: '',
    summary: '',
    evidenceItems: [],
    evidenceImages: [],
    publicUrl: ''
  });

  const loadingMessages = [
    "Grounding Search...",
    "GEO Visibility Audit...",
    "HO Criteria 2026...",
    "Scanning Digital Persona...",
    "Analyzing Evidence...",
    "Probability Matrix...",
    "Finalizing SEO/GEO Report..."
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

  const validate = (name: string, value: string) => {
    const newErrors = { ...errors };
    if (name === 'fullName') {
      if (value.trim().length < 2) {
        newErrors.fullName = "Name too short.";
      } else {
        delete newErrors.fullName;
      }
    }
    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = "Invalid email.";
      } else {
        delete newErrors.email;
      }
    }
    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      validate(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validate(name, value);
  };

  const nextStep = () => {
    if (step === 1) {
      validate('fullName', formData.fullName);
      validate('email', formData.email);
      setTouched({ fullName: true, email: true });
      if (formData.fullName.trim().length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return;
      }
    }
    setStep(s => s + 1);
  };
  
  const prevStep = () => setStep(s => s - 1);

  const addTextEvidence = () => {
    if (currentTextEvidence.trim()) {
      setFormData(prev => ({
        ...prev,
        evidenceItems: [...prev.evidenceItems, currentTextEvidence.trim()]
      }));
      setCurrentTextEvidence('');
    }
  };

  const removeTextEvidence = (index: number) => {
    setFormData(prev => ({
      ...prev,
      evidenceItems: prev.evidenceItems.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const availableSlots = 3 - formData.evidenceImages.length;
    if (availableSlots <= 0) return;
    const filesToUpload = Array.from(files).slice(0, availableSlots);
    filesToUpload.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, evidenceImages: [...prev.evidenceImages, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, evidenceImages: prev.evidenceImages.filter((_, i) => i !== index) }));
  };

  const saveToLocalStorage = (newRecord: AssessmentRecord) => {
    const KEY = 'gtv_submissions';
    try {
      const sanitizedRecord = {
        ...newRecord,
        profile: { ...newRecord.profile, evidenceImages: [] }
      };
      const existingRaw = localStorage.getItem(KEY);
      let existing: AssessmentRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [sanitizedRecord, ...existing].slice(0, 50); 
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save audit log:', err);
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || (step === 3 && !formData.summary)) {
        alert('Complete all required fields.');
        return;
    }
    setLoading(true);
    try {
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        if (!(await window.aistudio.hasSelectedApiKey())) await window.aistudio.openSelectKey();
      }
      const result = await analyzeEligibility(formData);
      const record: AssessmentRecord = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        profile: formData,
        result: result
      };
      saveToLocalStorage(record);
      onComplete(result, formData);
    } catch (error: any) {
      console.error(error);
      alert('Audit engine timeout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-6 py-2 animate-fade-in overflow-hidden relative pb-[var(--sab)] bg-white">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-6">
            <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <i className="fa-solid fa-sparkles text-[8px] animate-pulse text-[#F59E0B]"></i>
            </div>
          </div>
          <p className="text-[8px] font-black tracking-[0.4em] uppercase text-[#F59E0B] animate-pulse mb-1">{loadingMessages[loadingStep]}</p>
          <h3 className="text-lg font-black italic uppercase tracking-tighter">AI + GEO Audit</h3>
        </div>
      )}

      <div className="flex-grow flex flex-col overflow-hidden max-w-lg mx-auto w-full">
        <div className="flex justify-between items-end mb-4 pt-4">
          <div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">{stepsMetadata[step - 1].title}</h2>
            <p className="text-[7px] font-black tracking-widest text-gray-400 uppercase mt-1">Step {step}/3</p>
          </div>
          <div className="flex gap-1 pb-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-0.5 w-4 rounded-full transition-all duration-500 ${step >= i ? 'bg-black w-6' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-start overflow-y-auto no-scrollbar space-y-6 pb-20">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in pt-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Legal Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  autoFocus
                  className="w-full text-lg font-bold border-b border-gray-100 pb-2 outline-none focus:border-black transition-all bg-transparent"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.fullName && errors.fullName && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full text-lg font-bold border-b border-gray-100 pb-2 outline-none focus:border-black transition-all bg-transparent"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Professional URL</label>
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2 focus-within:border-black transition-all">
                  <i className="fa-solid fa-globe text-[10px] text-gray-300"></i>
                  <input 
                    type="url" 
                    name="publicUrl"
                    className="w-full text-sm font-medium outline-none bg-transparent"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.publicUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in pt-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Target Endorsement Body</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] text-sm font-bold outline-none appearance-none"
                  value={formData.route}
                  onChange={e => setFormData({...formData, route: e.target.value as VisaRoute})}
                >
                  {Object.values(VisaRoute).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Anticipated Career Stage</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] text-sm font-bold outline-none appearance-none"
                  value={formData.careerStage}
                  onChange={e => setFormData({...formData, careerStage: e.target.value as any})}
                >
                  <option value="Exceptional Talent">Exceptional Talent (Leader)</option>
                  <option value="Exceptional Promise">Exceptional Promise (Emerging)</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in pt-4">
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Current Role</label>
                <input 
                  type="text" 
                  className="w-full text-sm font-bold border-b border-gray-100 pb-2 focus:border-black outline-none bg-transparent"
                  placeholder="e.g. Lead Designer at Apple"
                  value={formData.currentRole}
                  onChange={e => setFormData({...formData, currentRole: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Key Evidence Tags</label>
                <div className="flex gap-2 items-center border-b border-gray-100 pb-2">
                  <input 
                    type="text" 
                    className="flex-grow text-[11px] font-bold outline-none bg-transparent"
                    placeholder="e.g. Patent US123, TechCrunch Article..."
                    value={currentTextEvidence}
                    onChange={e => setCurrentTextEvidence(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTextEvidence()}
                  />
                  <button onClick={addTextEvidence} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#F59E0B]"><i className="fa-solid fa-plus text-[10px]"></i></button>
                </div>
                <div className="flex flex-wrap gap-2 py-1">
                  {formData.evidenceItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-[9px] font-black text-gray-700">
                      {item}
                      <button onClick={() => removeTextEvidence(idx)} className="text-gray-400"><i className="fa-solid fa-circle-xmark"></i></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Portfolio Evidence (Max 3)</label>
                <div className="grid grid-cols-4 gap-3">
                  {formData.evidenceImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px]"><i className="fa-solid fa-trash"></i></button>
                    </div>
                  ))}
                  {formData.evidenceImages.length < 3 && (
                    <>
                      <button onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300 hover:border-black active:scale-95 transition-all">
                        <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                      </button>
                      <button onClick={() => cameraInputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-gray-100 flex items-center justify-center text-[#F59E0B]/40 hover:text-[#F59E0B] active:scale-95 transition-all">
                        <i className="fa-solid fa-camera text-lg"></i>
                      </button>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImageUpload} />
              </div>

              <div className="space-y-2">
                <label className="text-[8px] font-black uppercase tracking-widest text-gray-400">Statement of Impact</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-black/5"
                  placeholder="Tell us about your global impact..."
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-lg border-t border-gray-50 flex gap-3 pb-[calc(var(--sab)+1.5rem)] max-w-lg mx-auto w-full">
          {step > 1 && (
            <button onClick={prevStep} className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
          )}

          <button 
            onClick={step < 3 ? nextStep : handleSubmit}
            disabled={loading}
            className="flex-grow bg-[#111111] text-white h-14 rounded-2xl font-black italic tracking-widest uppercase text-[11px] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <i className="fa-solid fa-bolt-lightning text-[#F59E0B]"></i>}
            {loading ? 'Analyzing...' : step < 3 ? 'Continue' : 'Generate Audit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};

const stepsMetadata = [
  { title: 'Identity Audit' },
  { title: 'Framework Route' },
  { title: 'Evidence Matrix' }
];

export default AssessmentForm;