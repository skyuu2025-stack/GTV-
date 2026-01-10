import React from 'react';

interface HeroProps {
  onStart: () => void;
  onShowLegal: (type: 'terms' | 'privacy') => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onShowLegal }) => {
  return (
    <section className="w-full h-full flex flex-col bg-white animate-fade-in overflow-y-auto no-scrollbar scroll-container relative" aria-labelledby="hero-title">
      <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-[calc(var(--sat)+1rem)] pb-12 shrink-0">
        {/* Top Left Logo Branding */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-lg sm:text-xl italic shadow-2xl transition-transform hover:scale-110 cursor-default">
            G
          </div>
        </div>

        {/* Top Zone */}
        <div className="flex flex-col items-center w-full mt-16 sm:mt-24">
          <div className="inline-flex items-center gap-2 bg-[#F0F9FF] text-[#0284C7] px-5 py-1.5 rounded-full mb-6 border border-[#E0F2FE]">
            <i className="fa-solid fa-sparkles text-[9px]" aria-hidden="true"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Free Basic Audit Included</span>
          </div>

          <header className="text-center mb-2">
            <h1 id="hero-title" className="text-[14vw] sm:text-[80px] font-black italic tracking-tighter leading-[0.85] flex flex-col items-center uppercase">
              <span className="text-[#1A1A1A]">GLOBAL</span>
              <span className="text-[#1A1A1A]">TALENT</span>
              <span className="text-[#F59E0B]">VISA</span>
            </h1>
          </header>

          <p className="text-[#94A3B8] text-[11px] sm:text-lg font-bold italic text-center max-w-[240px] leading-tight opacity-90 mt-2">
            Get your endorsement probability score in <span className="text-black">60 seconds</span> for free.
          </p>
        </div>

        {/* Middle Zone */}
        <div className="flex gap-4 w-full max-w-[360px] mt-12 mb-8">
          <article className="flex-1 bg-[#F9FAFB] py-4 rounded-[28px] flex flex-col items-center justify-center gap-1.5 border border-gray-50/50 transition-all hover:bg-gray-100">
            <div className="text-black">
               <span className="text-[10px] font-black">FREE</span>
            </div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">Basic Score</span>
          </article>
          <article className="flex-1 bg-[#FFFBEB] py-4 rounded-[28px] flex flex-col items-center justify-center gap-1.5 border border-[#FEF3C7] transition-all hover:bg-[#FEF3C7]/40">
            <div className="text-[#F59E0B]">
              <i className="fa-solid fa-crown text-sm" aria-hidden="true"></i>
            </div>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-[#F59E0B]">Expert Report</span>
          </article>
        </div>

        {/* Bottom Zone */}
        <div className="w-full flex flex-col items-center gap-6">
          <button 
            onClick={onStart}
            className="w-full max-w-[340px] bg-[#111111] text-white py-5 rounded-[28px] font-black italic text-base tracking-widest uppercase shadow-premium active:scale-95 transition-all hover:bg-black"
          >
            Start Free Audit
          </button>

          <div className="flex flex-col items-center gap-3 pb-1">
            <nav className="flex gap-3 text-[7px] font-black uppercase tracking-[0.2em] text-[#94A3B8] opacity-60">
              <button onClick={() => onShowLegal('terms')} className="hover:text-black">Terms</button>
              <span>•</span>
              <button onClick={() => onShowLegal('privacy')} className="hover:text-black">Privacy</button>
            </nav>
            <div className="flex gap-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#94A3B8]">
              <span>2026 HO Rules</span>
              <span className="opacity-20">/</span>
              <span>Tech Nation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authority & Insights Section (Rich Content for SEO) */}
      <div className="w-full bg-[#FAFAFA] px-6 py-20 flex flex-col items-center border-t border-gray-100">
        <div className="max-w-xl w-full">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F59E0B] mb-4">How It Works</h2>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10 leading-none">The GTV Audit Process</h3>
          
          <div className="grid grid-cols-1 gap-12 mb-20">
            {[
              { step: '01', title: 'Data Ingestion', desc: 'Securely upload your professional summary and visual evidence. We prioritize privacy and sectoral alignment.' },
              { step: '02', title: 'AI Verification', desc: 'Our engine cross-references your claims with thousands of successful endorsement datasets and Home Office legislation.' },
              { step: '03', title: 'GEO Diagnostic', desc: 'We analyze your digital persona visibility to ensure endorsement panels see you as an "Exceptional Leader".' }
            ].map((item, idx) => (
              <article key={idx} className="flex gap-6">
                <span className="text-2xl font-black italic text-[#E2E8F0] leading-none">{item.step}</span>
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-widest">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F59E0B] mb-4">Endorsement Bodies</h2>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10 leading-none">Supported Routes</h3>
          <div className="grid grid-cols-2 gap-4 mb-20">
            {[
              { body: 'Tech Nation', field: 'Digital Tech' },
              { body: 'Arts Council', field: 'Arts & Culture' },
              { body: 'RIBA', field: 'Architecture' },
              { body: 'Pact', field: 'Film & TV' },
              { body: 'BFC', field: 'Fashion Design' },
              { body: 'Royal Academy', field: 'Engineering' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                 <div className="text-[10px] font-black uppercase mb-1">{item.body}</div>
                 <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{item.field}</div>
              </div>
            ))}
          </div>

          <div className="mt-20">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#F59E0B] mb-8">FAQ</h3>
             <div className="space-y-6">
                <details className="group border-b border-gray-200 pb-4">
                  <summary className="list-none cursor-pointer flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">Is the Global Talent Visa (GTV) still active in 2026?</span>
                    <i className="fa-solid fa-chevron-down text-[8px] transition-transform group-open:rotate-180"></i>
                  </summary>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed italic">Yes, the GTV remains a primary route for exceptional talent. Endorsement bodies continue to update their criteria annually to reflect changing sector needs.</p>
                </details>
                <details className="group border-b border-gray-200 pb-4">
                  <summary className="list-none cursor-pointer flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">Can AI actually predict visa success?</span>
                    <i className="fa-solid fa-chevron-down text-[8px] transition-transform group-open:rotate-180"></i>
                  </summary>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed italic">While we cannot guarantee results, our AI models use "Grounding" to fetch live 2026 policy documents, providing the highest accuracy estimation available.</p>
                </details>
             </div>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top helper */}
      <footer className="w-full py-12 flex justify-center bg-white border-t border-gray-50">
        <button 
          onClick={() => document.querySelector('.scroll-container')?.scrollTo({top: 0, behavior: 'smooth'})}
          className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-all"
        >
          Back to Top <i className="fa-solid fa-arrow-up ml-1"></i>
        </button>
      </footer>
    </section>
  );
};

export default Hero;