import React, { useState, useEffect, useRef } from 'react';
import { VisaRoute, UserProfile } from '../types.ts';
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
  
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    email: '',
    route: VisaRoute.TECH,
    careerStage: 'Exceptional Talent',
    currentRole: '',
    summary: '',
    evidenceItems: [],
    evidenceImages: []
  });

  const loadingMessages = [
    "Grounding Search...",
    "HO Criteria 2026...",
    "Scanning Bodies...",
    "Analyzing Evidence...",
    "Probability Matrix...",
    "Finalizing Report..."
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
      onComplete(result, formData);
    } catch (error: any) {
      console.error(error);
      alert('Audit engine timeout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-6 py-2 animate-fade-in overflow-hidden relative pb-[var(--sab)]">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center">
          <div className="relative mb-6">
            <div className="w-12 h-12 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <i className="fa-solid fa-earth-europe text-[8px] animate-pulse text-[#F59E0B]"></i>
            </div>
          </div>
          <p className="text-[8px] font-black tracking-[0.4em] uppercase text-[#F59E0B] animate-pulse mb-1">{loadingMessages[loadingStep]}</p>
          <h3 className="text-lg font-black italic uppercase tracking-tighter">Live Audit</h3>
        </div>
      )}

      <div className="flex-grow flex flex-col overflow-hidden max-w-lg mx-auto w-full">
        <div className="flex justify-between items-end mb-4 pt-2">
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

        <div className="flex-grow flex flex-col justify-start overflow-hidden space-y-4">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in pt-4">
              <div className="space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Legal Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  autoFocus
                  className="w-full text-base font-bold border-b border-gray-100 pb-1.5 outline-none focus:border-black transition-all bg-transparent"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full text-base font-bold border-b border-gray-100 pb-1.5 outline-none focus:border-black transition-all bg-transparent"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in pt-4">
              <div className="space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Route</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#FAFAFA] text-xs font-bold outline-none"
                  value={formData.route}
                  onChange={e => setFormData({...formData, route: e.target.value as VisaRoute})}
                >
                  {Object.values(VisaRoute).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Career Stage</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-[#FAFAFA] text-xs font-bold outline-none"
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
            <div className="space-y-4 animate-fade-in pb-4 flex flex-col h-full overflow-hidden">
              <div className="shrink-0 space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Current Role</label>
                <input 
                  type="text" 
                  className="w-full text-xs font-bold border-b border-gray-100 pb-1 focus:border-black outline-none bg-transparent"
                  placeholder="e.g. Senior Engineer"
                  value={formData.currentRole}
                  onChange={e => setFormData({...formData, currentRole: e.target.value})}
                />
              </div>

              <div className="shrink-0 space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Evidence Highlights</label>
                <div className="flex gap-2 items-center border-b border-gray-100 pb-1">
                  <input 
                    type="text" 
                    className="flex-grow text-[10px] font-bold outline-none bg-transparent"
                    placeholder="Award/Paper..."
                    value={currentTextEvidence}
                    onChange={e => setCurrentTextEvidence(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTextEvidence()}
                  />
                  <button onClick={addTextEvidence} className="text-[8px] font-black uppercase text-[#F59E0B]">Add</button>
                </div>
                <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-1">
                  {formData.evidenceItems.map((item, idx) => (
                    <div key={idx} className="shrink-0 flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-1.5 py-1 rounded-lg text-[8px] font-bold text-gray-600">
                      {item.length > 12 ? item.substring(0, 12) + '..' : item}
                      <button onClick={() => removeTextEvidence(idx)} className="text-gray-300"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="shrink-0 space-y-1">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Visuals</label>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {formData.evidenceImages.map((img, idx) => (
                    <div key={idx} className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-100">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[8px]"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                  ))}
                  {formData.evidenceImages.length < 3 && (
                    <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 shrink-0 rounded-lg border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-300">
                      <i className="fa-solid fa-plus text-[8px]"></i>
                    </button>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
              </div>

              <div className="flex-grow min-h-0 space-y-1 flex flex-col">
                <label className="text-[7px] font-black uppercase tracking-widest text-gray-400">Impact Summary</label>
                <textarea 
                  className="flex-grow w-full p-3 rounded-xl border border-gray-100 bg-[#FAFAFA] text-[10px] font-medium outline-none resize-none"
                  placeholder="Key career highlights..."
                  value={formData.summary}
                  onChange={e => setFormData({...formData, summary: e.target.value})}
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 flex gap-2 pb-2 bg-white">
          {step > 1 && (
            <button onClick={prevStep} className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 active:scale-95">
              <i className="fa-solid fa-chevron-left text-[9px]"></i>
            </button>
          )}

          {step < 3 ? (
            <button onClick={nextStep} className="flex-grow bg-[#111111] text-white h-10 rounded-xl font-black italic tracking-widest uppercase text-[9px]">
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="flex-grow bg-[#111111] text-white h-10 rounded-xl font-black italic tracking-widest uppercase flex items-center justify-center gap-2 text-[9px]"
            >
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-bolt-lightning text-[7px]"></i>}
              {loading ? 'Processing' : 'Execute Audit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const stepsMetadata = [
  { title: 'Identity', sub: 'PROFILE' },
  { title: 'Route', sub: 'FRAMEWORK' },
  { title: 'Evidence', sub: 'AUDIT' }
];

export default AssessmentForm;