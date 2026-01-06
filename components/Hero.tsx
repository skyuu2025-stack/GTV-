import React from 'react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="h-full flex flex-col items-center justify-between py-8 px-6 text-center animate-fade-in">
      {/* Top Section */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 bg-[#FFFBEB] text-[#D97706] px-3 py-1 rounded-full mb-6 border border-[#FEF3C7]">
          <i className="fa-solid fa-bolt text-[8px]"></i>
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">2026 AI ENGINE</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black italic tracking-tighter leading-[0.85] text-[#1A1A1A] flex flex-col items-center mb-4">
          <span>GLOBAL</span>
          <span>TALENT</span>
          <span className="text-[#F59E0B]">VISA</span>
        </h1>
        
        <p className="text-gray-400 text-sm font-medium italic max-w-[240px]">
          Professional UK endorsement roadmap powered by expert AI.
        </p>
      </div>

      {/* Center Section (Features) */}
      <div className="flex gap-3 scale-90 sm:scale-100">
        <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 w-32 flex flex-col items-center gap-3">
          <i className="fa-solid fa-shield-halved text-xl text-[#F59E0B]"></i>
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Endorsed</span>
        </div>
        <div className="bg-[#FAFAFA] border border-gray-50 rounded-[24px] p-5 w-32 flex flex-col items-center gap-3">
          <i className="fa-solid fa-clock text-xl text-[#F59E0B]"></i>
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fast-Track</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full flex flex-col items-center gap-8 mb-4">
        <button 
          onClick={onStart}
          className="w-full max-w-xs bg-[#111111] text-white py-5 rounded-[24px] font-black italic text-lg tracking-wider uppercase shadow-xl active:scale-95 transition-all"
        >
          Start Audit
        </button>

        <div className="flex flex-col items-center gap-2 opacity-30">
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">Aligned Frameworks</span>
          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
            <span>Tech Nation</span>
            <span>Arts Council</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;