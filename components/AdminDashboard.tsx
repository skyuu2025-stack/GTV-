import React, { useState, useEffect } from 'react';
import { AdminLog, AssessmentRecord } from '../types.ts';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [submissions, setSubmissions] = useState<AssessmentRecord[]>([]);
  const [uptime, setUptime] = useState(0);
  const [activeTab, setActiveTab] = useState<'logs' | 'users'>('logs');
  const [isScanning, setIsScanning] = useState(false);
  const currentHostname = window.location.hostname;
  const isProd = currentHostname === 'gtvassessor.com' || currentHostname === 'www.gtvassessor.com';

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    
    // Load local submissions
    const localData = JSON.parse(localStorage.getItem('gtv_submissions') || '[]');
    setSubmissions(localData);

    setLogs([
      { id: '1', timestamp: new Date().toISOString(), action: 'READY_PROD', details: 'All DNS records locked. Entering propagation phase.' },
      { id: '2', timestamp: new Date(Date.now() - 15000).toISOString(), action: 'SSL_WAIT', details: 'CA Authority processing CSR...' },
      { id: '3', timestamp: new Date(Date.now() - 45000).toISOString(), action: 'DB_SYNC', details: `Retrieved ${localData.length} records from persistent storage.` }
    ]);

    return () => clearInterval(interval);
  }, []);

  const handleResync = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const localData = JSON.parse(localStorage.getItem('gtv_submissions') || '[]');
      setSubmissions(localData);
    }, 1500);
  };

  const clearData = () => {
    if (confirm('Clear all local submissions?')) {
      localStorage.removeItem('gtv_submissions');
      setSubmissions([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-[#00FF41] p-4 sm:p-10 font-mono flex flex-col overflow-hidden animate-fade-in selection:bg-green-500 selection:text-black">
      {/* Matrix Header */}
      <div className="flex justify-between items-start border-b border-[#00FF41]/30 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_#00FF41] ${isProd ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'}`}></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">GTV_MAIN_FRAME</h2>
          </div>
          <p className="text-[10px] text-[#00FF41]/60 uppercase tracking-[0.3em]">
            Admin Privileges Enabled (Uptime: {uptime}s)
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleResync}
            className="border border-[#00FF41]/50 text-[#00FF41]/80 px-4 py-2 text-[10px] font-black rounded hover:bg-[#00FF41]/10 transition-all uppercase tracking-widest"
          >
            {isScanning ? 'Syncing...' : 'Sync Local DB'}
          </button>
          <button 
            onClick={onClose}
            className="bg-[#00FF41] text-black px-6 py-2 text-[10px] font-black rounded hover:opacity-80 transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,65,0.4)]"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 border-b border-[#00FF41]/10 pb-2">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 ${activeTab === 'logs' ? 'bg-[#00FF41] text-black' : 'opacity-40 hover:opacity-100'}`}
        >
          Kernel Logs
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 ${activeTab === 'users' ? 'bg-[#00FF41] text-black' : 'opacity-40 hover:opacity-100'}`}
        >
          User Submissions ({submissions.length})
        </button>
      </div>

      <div className="flex-grow bg-[#00FF41]/5 border border-[#00FF41]/20 rounded-3xl overflow-hidden flex flex-col">
        {activeTab === 'logs' ? (
          <div className="p-6 overflow-y-auto space-y-3 no-scrollbar flex-grow">
            {logs.map(log => (
              <div key={log.id} className="flex gap-4 items-start text-[11px] font-medium animate-fade-in">
                <span className="opacity-30 shrink-0">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                <span className="text-white font-black uppercase w-28 shrink-0">{log.action}</span>
                <span className="opacity-80">{log.details}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 overflow-y-auto no-scrollbar flex-grow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Stored_User_Profiles</h3>
              <button onClick={clearData} className="text-[9px] text-red-500 hover:text-red-400 uppercase font-black underline">Wipe_Local_Data</button>
            </div>
            
            {submissions.length === 0 ? (
              <div className="h-40 flex items-center justify-center opacity-30 text-[10px]">NO_DATA_RECORDS_FOUND</div>
            ) : (
              <div className="space-y-6">
                {submissions.map((sub) => (
                  <div key={sub.id} className="border border-[#00FF41]/20 p-4 rounded-xl hover:bg-[#00FF41]/5 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[12px] font-black text-white group-hover:text-[#00FF41] transition-colors uppercase">{sub.profile.fullName}</div>
                      <div className="text-[9px] opacity-40">#{sub.id} | {new Date(sub.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      <div>
                        <div className="opacity-40 uppercase text-[8px] mb-0.5 tracking-tighter">Email</div>
                        <div className="text-white/80">{sub.profile.email}</div>
                      </div>
                      <div>
                        <div className="opacity-40 uppercase text-[8px] mb-0.5 tracking-tighter">Route</div>
                        <div className="text-white/80">{sub.profile.route}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="opacity-40 uppercase text-[8px] mb-0.5 tracking-tighter">Audit Result</div>
                        <div className="text-[#F59E0B] font-black">{sub.result.score}/100 - {sub.result.probability} Probability</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-black flex items-center justify-between text-[9px] font-black tracking-widest border-t border-[#00FF41]/20 shrink-0">
          <span>ENCRYPTED_ACCESS_ACTIVE</span>
          <span>S_MAPPING_PROD</span>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;