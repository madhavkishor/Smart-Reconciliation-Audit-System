
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, TransactionRecord, AuditLog, MatchStatus } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import ReconciliationView from './components/ReconciliationView';
import AuditTimeline from './components/AuditTimeline';
import { generateSystemRecords } from './services/mockData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'u1',
    name: 'John Analyst',
    role: UserRole.ANALYST
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'reconciliation' | 'audit'>('dashboard');
  const [systemRecords, setSystemRecords] = useState<TransactionRecord[]>([]);
  const [uploadedRecords, setUploadedRecords] = useState<TransactionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Initialize mock system data
  useEffect(() => {
    setSystemRecords(generateSystemRecords(100));
  }, []);

  const handleManualCorrection = (recordId: string, field: string, newValue: string) => {
    if (currentUser.role === UserRole.VIEWER) return;

    setUploadedRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        const oldValue = String((rec as any)[field]);
        const newLog: AuditLog = {
          id: Math.random().toString(36).substr(2, 9),
          recordId,
          field,
          oldValue,
          newValue,
          user: currentUser.name,
          timestamp: new Date().toISOString(),
          source: 'Manual Correction'
        };
        setAuditLogs(logs => [newLog, ...logs]);
        return { ...rec, [field]: field === 'amount' ? parseFloat(newValue) : newValue };
      }
      return rec;
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 capitalize">
            {activeTab} {activeTab === 'upload' ? 'Transactions' : ''}
          </h1>
          <p className="text-slate-500">Welcome back, {currentUser.name} ({currentUser.role})</p>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              systemRecords={systemRecords} 
              uploadedRecords={uploadedRecords} 
            />
          )}

          {activeTab === 'upload' && (
            <FileUpload 
              onUploadComplete={(records) => {
                setUploadedRecords(records);
                setActiveTab('reconciliation');
              }}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'reconciliation' && (
            <ReconciliationView 
              systemRecords={systemRecords} 
              uploadedRecords={uploadedRecords}
              onManualUpdate={handleManualCorrection}
              userRole={currentUser.role}
            />
          )}

          {activeTab === 'audit' && (
            <AuditTimeline logs={auditLogs} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
