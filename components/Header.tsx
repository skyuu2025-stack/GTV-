import React from 'react';

interface HeaderProps {
  onLogoClick: (count: number) => void;
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onGoHome }) => {
  const [clicks, setClicks] = React.useState(0);

  const handleLogoPress = () => {
    const nextCount = clicks + 1;
    setClicks(nextCount);
    onLogoClick(nextCount);
  };

  return (
    <header className="px-6 pb-4 pt-[calc(var(--sat)+1rem)] flex justify-between items-center bg-white/80 backdrop-blur-md z-50 border-b border-gray-50">
      <div 
        onClick={handleLogoPress}
        className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-transform"
      >
        <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-black text-[11px] italic shadow-lg">
          G
        </div>
        <span className="font-black text-[10px] tracking-[0.2em] uppercase">GTV ASSESSOR</span>
      </div>
      
      <button 
        onClick={onGoHome}
        className="text-[9px] font-black tracking-widest text-gray-400 hover:text-black border border-gray-200 px-4 py-2 rounded-full transition-all uppercase active:bg-gray-50"
      >
        Reset
      </button>
    </header>
  );
};

export default Header;