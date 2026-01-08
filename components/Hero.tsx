import React from 'react';

interface HeroProps {
  onStart: () => void;
  onShowLegal: (type: 'terms' | 'privacy') => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onShowLegal }) => {
  return (
    <section className="w-full h-full flex flex-col items-center justify-between bg-white px-6 animate-fade-in pt-[calc(var(--sat)+1rem)] pb-[calc(var(--sab)+2rem)] overflow-hidden relative">
      {/* Top Left Logo Branding */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl italic shadow-2xl transition-transform hover:scale-110 cursor-default">
          G
        </div>
      </div>

      {/* Top Zone */}
      <div className="flex flex-col items-center w-full mt-16 sm:mt-24">
        <div className="inline-flex items-center gap-2 bg-[#F0F9FF] text-[#0284C7] px-5 py-1.5 rounded-full mb-6 border border-[#E0F2FE]">
          <i className="fa-solid fa-sparkles text-[9px]"></i>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Free Basic Audit Included</span>
        </div>

        <div className="text-center mb-2">
          <h1 className="text-[14vw] sm:text-[80px] font-black italic tracking-tighter leading-[0.85] flex flex-col items-center uppercase">
            <span className="text-[#1A1A1A]">GLOBAL</span>
            <span className="text-[#1A1A1A]">TALENT</span>
            <span className="text-[#F59E0B]">VISA</span>
          </h1>
        </div>

        <p className="text-[#94A3B8] text-[11px] sm:text-lg font-bold italic text-center max-w-[240px] leading-tight opacity-90 mt-2">
          Get your endorsement probability score in <span className="text-black">60 seconds</span> for free.
        </p>
      </div>

      {/* Middle Zone */}
      <div className="flex gap-4 w-full max-w-[360px] mt-12 mb-8">
        <div className="flex-1 bg-[#F9FAFB] py-4 rounded-[28px] flex flex-col items-center justify-center gap-1.5 border border-gray-50/50">
          <div className="text-black">
             <span className="text-[10px] font-black">FREE</span>
          </div>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">Basic Score</span>
        </div>
        <div className="flex-1 bg-[#FFFBEB] py-4 rounded-[28px] flex flex-col items-center justify-center gap-1.5 border border-[#FEF3C7]">
          <div className="text-[#F59E0B]">
            <i className="fa-solid fa-crown text-sm"></i>
          </div>
          <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">Expert Report</span>
        </div>
      </div>

      {/* Bottom Zone */}
      <div className="w-full flex flex-col items-center gap-6">
        <button 
          onClick={onStart}
          className="w-full max-w-[340px] bg-[#111111] text-white py-5 rounded-[28px] font-black italic text-base tracking-widest uppercase shadow-premium active:scale-95 transition-all"
        >
          Start Free Audit
        </button>

        <div className="flex flex-col items-center gap-3 pb-1">
          <div className="flex gap-3 text-[7px] font-black uppercase tracking-[0.2em] text-[#94A3B8] opacity-60">
            <button onClick={() => onShowLegal('terms')} className="hover:text-black">Terms</button>
            <span>•</span>
            <button onClick={() => onShowLegal('privacy')} className="hover:text-black">Privacy</button>
          </div>
          <div className="flex gap-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
            <span>2026 HO Rules</span>
            <span className="opacity-20">/</span>
            <span>Tech Nation</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;