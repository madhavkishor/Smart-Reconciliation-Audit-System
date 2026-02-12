
import React, { useState } from 'react';
import { TransactionRecord, MatchStatus, UserRole } from '../types';

interface ReconciliationViewProps {
  systemRecords: TransactionRecord[];
  uploadedRecords: TransactionRecord[];
  onManualUpdate: (id: string, field: string, value: string) => void;
  userRole: UserRole;
}

const ReconciliationView: React.FC<ReconciliationViewProps> = ({ 
  systemRecords, 
  uploadedRecords, 
  onManualUpdate,
  userRole 
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const getStatusColor = (status?: MatchStatus) => {
    switch (status) {
      case MatchStatus.MATCHED: return 'bg-emerald-100 text-emerald-700';
      case MatchStatus.PARTIAL: return 'bg-amber-100 text-amber-700';
      case MatchStatus.DUPLICATE: return 'bg-violet-100 text-violet-700';
      case MatchStatus.UNMATCHED: return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Uploaded Data Reconciliation</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-3 h-3 bg-emerald-400 rounded-full"></span> Matched
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span> Partial
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="w-3 h-3 bg-rose-400 rounded-full"></span> Unmatched
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-600 border-b border-slate-100">
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Transaction ID</th>
              <th className="px-6 py-4 font-bold">Amount (USD)</th>
              <th className="px-6 py-4 font-bold">Reference #</th>
              <th className="px-6 py-4 font-bold">Date</th>
              {userRole !== UserRole.VIEWER && <th className="px-6 py-4 font-bold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {uploadedRecords.map((record) => {
              const sysRecord = systemRecords.find(s => s.id === record.matchedId);
              const isEditing = editingId === record.id;

              return (
                <React.Fragment key={record.id}>
                  <tr className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={record.transactionId}
                          onBlur={(e) => onManualUpdate(record.id, 'transactionId', e.target.value)}
                          className="w-full border rounded px-2 py-1 outline-blue-500"
                        />
                      ) : (
                        record.transactionId
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input 
                          type="number" 
                          defaultValue={record.amount}
                          onBlur={(e) => onManualUpdate(record.id, 'amount', e.target.value)}
                          className="w-full border rounded px-2 py-1 outline-blue-500"
                        />
                      ) : (
                        <span className={record.mismatchedFields?.includes('amount') ? 'text-red-600 font-bold underline decoration-dotted' : ''}>
                          ${record.amount.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{record.referenceNumber}</td>
                    <td className="px-6 py-4 text-slate-500">{record.date}</td>
                    {userRole !== UserRole.VIEWER && (
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setEditingId(isEditing ? null : record.id)}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          {isEditing ? 'Done' : 'Edit'}
                        </button>
                      </td>
                    )}
                  </tr>
                  {/* System record sub-row for partial matches */}
                  {record.status === MatchStatus.PARTIAL && sysRecord && (
                    <tr className="bg-amber-50/30 text-xs">
                      <td className="px-6 py-2 text-slate-400 font-bold italic">SYSTEM RECORD (Ref Match)</td>
                      <td className="px-6 py-2 text-slate-400">{sysRecord.transactionId}</td>
                      <td className="px-6 py-2 text-slate-400 font-bold">${sysRecord.amount.toLocaleString()}</td>
                      <td className="px-6 py-2 text-slate-400">{sysRecord.referenceNumber}</td>
                      <td className="px-6 py-2 text-slate-400" colSpan={2}>{sysRecord.date}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReconciliationView;
