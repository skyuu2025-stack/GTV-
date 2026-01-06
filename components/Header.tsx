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
    <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md z-50">
      <div 
        onClick={handleLogoPress}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <div className="w-7 h-7 bg-black text-white rounded flex items-center justify-center font-black text-[10px] italic">
          G
        </div>
        <span className="font-black text-[10px] tracking-[0.2em] uppercase">GTV ASSESSOR</span>
      </div>
      
      <button 
        onClick={onGoHome}
        className="text-[9px] font-bold tracking-widest text-gray-400 hover:text-black border border-gray-100 px-3 py-1.5 rounded-full transition-all uppercase"
      >
        Reset
      </button>
    </header>
  );
};

export default Header;