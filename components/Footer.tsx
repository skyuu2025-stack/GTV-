
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 flex flex-col items-center gap-8 bg-white shrink-0">
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
            Independent 2026 UK GTV Audit
          </p>
          <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
            Framework
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
          <div className="w-1.5 h-1.5 bg-gray-100 rounded-full"></div>
          <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
          <div className="w-1.5 h-1.5 bg-gray-100 rounded-full"></div>
          <span className="hover:text-black cursor-pointer transition-colors">Security</span>
          <div className="w-1.5 h-1.5 bg-gray-100 rounded-full"></div>
        </div>
    </footer>
  );
};

export default Footer;
