
import React, { useState, useEffect } from 'react';
import { AdminLog } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [logs, setLogs] = useState<AdminLog[]>([]);

  useEffect(() => {
    // Generate some mock activity
    setLogs([
      { id: '1', timestamp: new Date().toISOString(), action: 'AI Model Call', details: 'Gemini-3-flash assessment completed for user UID-882' },
      { id: '2', timestamp: new Date(Date.now() - 50000).toISOString(), action: 'Database Query', details: 'Fetched Visa criteria for Tech Nation route' },
      { id: '3', timestamp: new Date(Date.now() - 120000).toISOString(), action: 'Auth Event', details: 'Admin logged in via logo click pattern' }
    ]);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white p-6 font-mono flex flex-col overflow-hidden">
      <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold uppercase tracking-tighter">System Backend Console</h2>
        </div>
        <button 
          onClick={onClose}
          className="bg-white text-black px-4 py-1 text-xs font-bold rounded hover:bg-gray-300"
        >
          TERMINATE SESSION [ESC]
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-grow overflow-hidden">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">API STATUS</div>
            <div className="text-lg text-green-400">ACTIVE - 24ms</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">CURRENT MODEL</div>
            <div className="text-lg text-blue-400">gemini-3-flash</div>
          </div>
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">TOKENS USED</div>
            <div className="text-lg">1,248,392</div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5 text-xs font-bold">SYSTEM LOGS</div>
          <div className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide">
            {logs.map(log => (
              <div key={log.id} className="text-xs">
                <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                <span className="text-blue-400 font-bold">{log.action}:</span>{' '}
                <span className="text-gray-300">{log.details}</span>
              </div>
            ))}
            <div className="pt-4 text-green-400/50 animate-pulse text-[10px]">
              &gt; RUNNING BACKGROUND DIAGNOSTICS...<br/>
              &gt; CHECKING UK HO UPDATES...<br/>
              &gt; NO ANOMALIES DETECTED.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-[10px] text-gray-600 flex justify-between">
        <span>GTV-ASSESSOR-V2.0.4-INTERNAL</span>
        <span>SECURITY ENCRYPTED: AES-256</span>
      </div>
    </div>
  );
};

export default AdminDashboard;
