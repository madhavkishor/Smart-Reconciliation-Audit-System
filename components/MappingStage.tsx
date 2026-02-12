
import React, { useState } from 'react';
import { TransactionRecord, MatchStatus } from '../types';
import { reconcileRecords } from '../services/reconciliationEngine';

interface MappingStageProps {
  preview: any[][];
  onComplete: (records: TransactionRecord[]) => void;
  onBack: () => void;
}

const MappingStage: React.FC<MappingStageProps> = ({ preview, onComplete, onBack }) => {
  const headers = preview[0];
  const [mapping, setMapping] = useState<Record<string, string>>({
    'Transaction ID': headers.find(h => h.toLowerCase().includes('id')) || '',
    'Amount': headers.find(h => h.toLowerCase().includes('amount')) || '',
    'Reference Number': headers.find(h => h.toLowerCase().includes('ref')) || '',
    'Date': headers.find(h => h.toLowerCase().includes('date')) || '',
  });

  const mandatoryFields = ['Transaction ID', 'Amount', 'Reference Number', 'Date'];

  const handleFinish = () => {
    // Convert preview data to TransactionRecords
    // Fixed: Explicitly cast 'source' to 'UPLOADED' as const to prevent type widening and match TransactionRecord interface
    const records: TransactionRecord[] = preview.slice(1).map((row, idx) => {
      const getVal = (sysField: string) => {
        const headerIdx = headers.indexOf(mapping[sysField]);
        return row[headerIdx]?.trim();
      };

      return {
        id: `u-${idx}`,
        transactionId: getVal('Transaction ID') || '',
        amount: parseFloat(getVal('Amount') || '0'),
        referenceNumber: getVal('Reference Number') || '',
        date: getVal('Date') || new Date().toISOString(),
        source: 'UPLOADED' as const,
        uploadedBy: 'John Analyst'
      };
    }).filter(r => r.transactionId);

    onComplete(reconcileRecords(records));
  };

  const isMappingComplete = mandatoryFields.every(field => mapping[field] !== '');

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Map Columns</h3>
          <p className="text-slate-500">Select which column corresponds to our required fields.</p>
        </div>
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 font-medium">← Change File</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-6">
          {mandatoryFields.map(field => (
            <div key={field}>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {field} <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                value={mapping[field]}
                onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
              >
                <option value="">Select column...</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-4">Why is this needed?</h4>
          <ul className="text-sm text-slate-600 space-y-3">
            <li className="flex gap-2"><span>✅</span> Map unique IDs for exact matching</li>
            <li className="flex gap-2"><span>✅</span> Reference numbers for partial matching logic</li>
            <li className="flex gap-2"><span>✅</span> Amounts for variance analysis</li>
          </ul>
          
          {!isMappingComplete && (
            <div className="mt-8 p-4 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-100">
              Please map all required fields to continue.
            </div>
          )}
        </div>
      </div>

      <button 
        disabled={!isMappingComplete}
        onClick={handleFinish}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          isMappingComplete 
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/10' 
          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
        }`}
      >
        Run Intelligent Reconciliation
      </button>
    </div>
  );
};

export default MappingStage;
