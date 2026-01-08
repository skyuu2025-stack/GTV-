import React from 'react';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

const LegalModals: React.FC<LegalModalProps> = ({ type, onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[32px] p-8 max-h-[80vh] overflow-y-auto no-scrollbar shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">
          {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        </h2>

        <div className="prose prose-sm text-gray-500 font-medium leading-relaxed space-y-4 text-[11px]">
          {type === 'terms' ? (
            <>
              <p className="font-bold text-black uppercase tracking-widest text-[9px]">1. AI-Powered Assessment</p>
              <p>GTV AI Assessor is an independent audit tool utilizing the Google Gemini API. Results are generated via algorithmic analysis and do not constitute legal advice.</p>
              
              <p className="font-bold text-black uppercase tracking-widest text-[9px]">2. No Guarantee of Success</p>
              <p>The "Endorsement Probability" and "Roadmap" provided are for informational purposes only. Official endorsement is granted solely by the Home Office and relevant endorsing bodies (e.g., Tech Nation).</p>

              <p className="font-bold text-black uppercase tracking-widest text-[9px]">3. User Responsibility</p>
              <p>Users are responsible for the accuracy of the data provided. Misleading entries will result in inaccurate audit scores.</p>
              
              <p className="font-bold text-black uppercase tracking-widest text-[9px]">4. Intellectual Property</p>
              <p>The 2026 Audit Framework and proprietary scoring logic are the intellectual property of GTV Assessor.</p>
            </>
          ) : (
            <>
              <p className="font-bold text-black uppercase tracking-widest text-[9px]">1. Data Collection</p>
              <p>We collect your Name, Email, Career Role, and Evidence details solely to perform the AI Audit. This data is processed in real-time by Google's Gemini models.</p>

              <p className="font-bold text-black uppercase tracking-widest text-[9px]">2. Data Storage</p>
              <p>Submissions are stored locally for administrative audit purposes and to allow you to restore your results. We do not sell or share your professional data with third-party advertisers.</p>

              <p className="font-bold text-black uppercase tracking-widest text-[9px]">3. Rights</p>
              <p>You may request the removal of your audit data at any time by contacting our support team.</p>

              <p className="font-bold text-black uppercase tracking-widest text-[9px]">4. Cookies</p>
              <p>We use essential cookies to maintain your session and track audit progress. No tracking cookies are used for marketing.</p>
            </>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-transform"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};

export default LegalModals;