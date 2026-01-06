import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 px-6 border-t border-gray-50 flex flex-col items-center gap-4">
        <p className="text-gray-300 text-[8px] font-black max-w-[200px] leading-relaxed uppercase tracking-[0.2em] text-center">
          Independent 2026 UK GTV Audit Framework
        </p>
        <div className="flex gap-6 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">
          <span className="text-black/10">●</span>
          <span>Privacy</span>
          <span className="text-black/10">●</span>
          <span>Security</span>
          <span className="text-black/10">●</span>
        </div>
    </footer>
  );
};

export default Footer;