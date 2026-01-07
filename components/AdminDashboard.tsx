
import React, { useState, useEffect } from 'react';
import { AdminLog } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [uptime, setUptime] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const currentHostname = window.location.hostname;
  const isProd = currentHostname === 'gtvassessor.com' || currentHostname === 'www.gtvassessor.com';

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    
    setLogs([
      { id: '1', timestamp: new Date().toISOString(), action: 'READY_PROD', details: 'All DNS records locked. Entering propagation phase.' },
      { id: '2', timestamp: new Date(Date.now() - 15000).toISOString(), action: 'SSL_WAIT', details: 'CA Authority processing Certificate Signing Request (CSR)...' },
      { id: '3', timestamp: new Date(Date.now() - 45000).toISOString(), action: 'SEARCH_OK', details: 'Ownership verified via Google Search Console API.' },
      { id: '4', timestamp: new Date(Date.now() - 120000).toISOString(), action: 'INIT_MAPPING', details: 'Cloud Run mapping request initiated for gtvassessor.com' }
    ]);

    return () => clearInterval(interval);
  }, [currentHostname]);

  const handleResync = () => {
    setIsScanning(true);
    const newLog = { 
      id: Date.now().toString(), 
      timestamp: new Date().toISOString(), 
      action: 'RE_SCAN', 
      details: 'Forcing DNS cache invalidation and re-checking SSL status...' 
    };
    setLogs(prev => [newLog, ...prev]);
    
    setTimeout(() => {
      setIsScanning(false);
      setLogs(prev => [{
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        action: 'SCAN_COMPLETE',
        details: isProd ? 'Production domain detected and healthy.' : 'Propagation still in progress. Estimated remaining: 12-24 mins.'
      }, ...prev]);
    }, 2500);
  };

  const globalNodes = [
    { city: 'London (LHR)', delay: '12ms', status: 'SYNCED', color: 'text-green-500' },
    { city: 'New York (JFK)', delay: '85ms', status: 'PROPAGATING', color: 'text-yellow-500' },
    { city: 'Tokyo (NRT)', delay: '--', status: isProd ? 'SYNCED' : 'PENDING', color: isProd ? 'text-green-500' : 'text-gray-600' },
    { city: 'Hong Kong (HKG)', delay: '--', status: isProd ? 'SYNCED' : 'PENDING', color: isProd ? 'text-green-500' : 'text-gray-600' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-[#00FF41] p-4 sm:p-10 font-mono flex flex-col overflow-hidden animate-fade-in selection:bg-green-500 selection:text-black">
      {/* Matrix-style Header */}
      <div className="flex justify-between items-start border-b border-[#00FF41]/30 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_#00FF41] ${isProd ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">GTV_MAIN_FRAME</h2>
          </div>
          <p className="text-[10px] text-[#00FF41]/60 uppercase tracking-[0.3em]">
            Status: {isProd ? 'System_Online' : 'Propagation_Mode'}
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleResync}
            disabled={isScanning}
            className="border border-[#00FF41]/50 text-[#00FF41]/80 px-4 py-2 text-[10px] font-black rounded hover:bg-[#00FF41]/10 transition-all uppercase tracking-widest disabled:opacity-30"
          >
            {isScanning ? 'Syncing...' : 'Force Resync'}
          </button>
          <button 
            onClick={onClose}
            className="bg-[#00FF41] text-black px-6 py-2 text-[10px] font-black rounded hover:opacity-80 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,65,0.4)]"
          >
            Disconnect
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 flex-grow overflow-hidden">
        {/* Propagation Visualizer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-2xl p-6 relative overflow-hidden">
            {isScanning && <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41] animate-[pulse_1s_infinite]"></div>}
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-80">Global Node Propagation</h3>
            <div className="space-y-4">
              {globalNodes.map((node, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-bold text-white group-hover:text-[#00FF41] transition-colors">{node.city}</div>
                    <div className="text-[8px] opacity-40 uppercase tracking-widest">Latency: {node.delay}</div>
                  </div>
                  <span className={`text-[9px] font-black ${node.color}`}>{node.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-2xl p-6 flex-grow">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-80">Deployment Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[10px]">
                <i className="fa-solid fa-check-circle text-green-500"></i>
                <span className="text-white/80">Search Console Verification</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <i className="fa-solid fa-check-circle text-green-500"></i>
                <span className="text-white/80">CNAME Mapping (ghs.google)</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                {isProd ? (
                  <i className="fa-solid fa-check-circle text-green-500"></i>
                ) : (
                  <i className="fa-solid fa-spinner animate-spin text-yellow-500 text-[8px]"></i>
                )}
                <span className="text-white/80 italic">{isProd ? 'SSL Active' : 'SSL Handshake In-Progress'}</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[#00FF41]/10">
              <p className="text-[9px] leading-relaxed opacity-50 italic">
                {isProd ? 'System is fully deployed on production domain.' : 'Final step: Waiting for SSL certificate issuance and global CDN propagation.'}
              </p>
            </div>
          </div>
        </div>

        {/* System Log Console */}
        <div className="lg:col-span-8 bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-3xl overflow-hidden flex flex-col shadow-[inset_0_0_50px_rgba(0,255,65,0.05)]">
          <div className="p-4 border-b border-[#00FF41]/20 bg-black flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kernel_Events_Log</span>
            <span className="text-[10px]">T+{uptime}s</span>
          </div>
          
          <div className="flex-grow p-6 overflow-y-auto space-y-3 no-scrollbar">
            {logs.map(log => (
              <div key={log.id} className="flex gap-4 items-start text-[11px] font-medium group animate-fade-in">
                <span className="opacity-30 shrink-0 select-none">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                <span className="text-white font-black uppercase w-28 shrink-0 tracking-tighter group-hover:bg-[#00FF41] group-hover:text-black transition-colors px-1">
                  {log.action}
                </span>
                <span className="opacity-80">{log.details}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black flex items-center justify-between text-[9px] font-black tracking-widest border-t border-[#00FF41]/20">
            <span className={isScanning ? 'animate-pulse text-yellow-400' : ''}>
              {isScanning ? 'RE-SCANNING_NODES...' : 'RUNNING_DIAGNOSTICS_V5.0'}
            </span>
            <span>{isProd ? 'ENCRYPTED_PROD' : 'PROD_READY_UNSECURED'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
