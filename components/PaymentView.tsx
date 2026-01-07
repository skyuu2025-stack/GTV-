import React from 'react';
import { UserProfile } from '../types.ts';

interface PaymentViewProps {
  profile: UserProfile;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ profile, onPaymentSuccess, onCancel }) => {
  const STRIPE_URL = "https://buy.stripe.com/5kQbIT444bzybaQbTZ1Jm00";

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-8 animate-fade-in bg-white overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md flex flex-col items-center text-center">
        {/* Animated Icon Zone */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-[#F59E0B] rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3">
             <i className="fa-solid fa-crown text-black text-3xl"></i>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center border-4 border-white">
             <i className="fa-solid fa-bolt text-[#F59E0B] text-[10px]"></i>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Upgrade to Expert Audit</span>
        <h2 className="text-4xl font-black italic tracking-tighter leading-none uppercase mb-4">
          Unlock the Full <span className="text-[#F59E0B]">Expert</span> Analysis
        </h2>
        
        <p className="text-gray-400 text-xs font-bold italic mb-8 max-w-[280px]">
          You have successfully completed the basic audit. Upgrade now to access the professional GTV roadmap.
        </p>

        {/* Comparison List */}
        <div className="w-full bg-[#FAFAFA] rounded-[32px] p-6 border border-gray-100 mb-10 text-left space-y-4">
          <div className="flex items-start gap-3">
             <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
             <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest">Full 2026 Audit Roadmap</p>
                <p className="text-[8px] text-gray-400 font-bold italic uppercase tracking-wider">Step-by-step endorsement actions.</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
             <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest">Competency Matrix</p>
                <p className="text-[8px] text-gray-400 font-bold italic uppercase tracking-wider">Radar analysis of your talent vs peers.</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <i className="fa-solid fa-circle-check text-green-500 mt-1"></i>
             <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest">PDF Export & Grounding</p>
                <p className="text-[8px] text-gray-400 font-bold italic uppercase tracking-wider">Verified links to endorsement sources.</p>
             </div>
          </div>
        </div>

        {/* Action Zone */}
        <div className="w-full space-y-4">
          <a 
            href={STRIPE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#111111] text-white py-5 rounded-[28px] font-black italic text-base tracking-widest uppercase shadow-premium active:scale-95 transition-all text-center"
          >
            Upgrade & Access Full Report
          </a>
          
          <button 
            onClick={onPaymentSuccess}
            className="w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-black transition-colors"
          >
            Already Paid? <span className="underline decoration-[#F59E0B] decoration-2 underline-offset-4">Restore Access</span>
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="mt-8 text-[8px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors"
        >
          Return to Basic Audit
        </button>
      </div>
    </div>
  );
};

export default PaymentView;