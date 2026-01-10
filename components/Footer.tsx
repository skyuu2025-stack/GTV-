import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 flex flex-col items-center gap-10 bg-white shrink-0 border-t border-gray-50" aria-label="Site Footer">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 w-full max-w-xl text-center sm:text-left">
           <div className="space-y-4">
             <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-black">Endorsement Routes</h4>
             <ul className="text-[8px] font-bold text-gray-400 space-y-2 uppercase tracking-widest">
                <li className="hover:text-[#F59E0B] cursor-pointer">Digital Technology</li>
                <li className="hover:text-[#F59E0B] cursor-pointer">Arts & Culture</li>
                <li className="hover:text-[#F59E0B] cursor-pointer">Research & Science</li>
             </ul>
           </div>
           <div className="space-y-4">
             <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-black">Audit Framework</h4>
             <ul className="text-[8px] font-bold text-gray-400 space-y-2 uppercase tracking-widest">
                <li className="hover:text-[#F59E0B] cursor-pointer">GEO Diagnostic</li>
                <li className="hover:text-[#F59E0B] cursor-pointer">Competency Matrix</li>
                <li className="hover:text-[#F59E0B] cursor-pointer">PDF Documentation</li>
             </ul>
           </div>
           <div className="col-span-2 sm:col-span-1 space-y-4">
             <h4 className="text-[8px] font-black uppercase tracking-[0.3em] text-black">Legal & Support</h4>
             <ul className="text-[8px] font-bold text-gray-400 space-y-2 uppercase tracking-widest">
                <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                <li className="hover:text-black cursor-pointer">Terms of Service</li>
                <li className="hover:text-black cursor-pointer">Contact Email</li>
             </ul>
           </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-black text-[10px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
            GTV AI ASSESSOR 2026
          </p>
          <p className="text-[#94A3B8] text-[7px] font-bold uppercase tracking-[0.1em] text-center opacity-40">
            Independent Audit Framework • Powered by Gemini AI
          </p>
        </div>
        
        <div className="text-[7px] font-medium text-gray-300 uppercase tracking-widest text-center max-w-xs leading-loose">
          Disclaimer: This application provides automated analysis based on publicly available Home Office criteria. It is not affiliated with the UK Government, Tech Nation, or the Home Office.
        </div>
    </footer>
  );
};

export default Footer;