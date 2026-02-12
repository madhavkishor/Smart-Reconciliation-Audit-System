
import React from 'react';
import { AuditLog } from '../types';

interface AuditTimelineProps {
  logs: AuditLog[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-slate-200">
        <p className="text-slate-400 font-medium italic">No modifications have been recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {logs.map((log, index) => (
        <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {index === 0 ? '✨' : '📝'}
          </div>
          
          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all hover:border-blue-300">
            <div className="flex items-center justify-between space-x-2 mb-2">
              <div className="font-bold text-slate-800">{log.field.toUpperCase()} CHANGED</div>
              <time className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {new Date(log.timestamp).toLocaleTimeString()}
              </time>
            </div>
            <div className="text-slate-500 text-sm mb-4">
              Performed by <span className="font-bold text-slate-700">{log.user}</span> via <span className="italic">{log.source}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex-1 bg-rose-50 text-rose-700 p-2 rounded border border-rose-100 line-through">
                {log.oldValue}
              </div>
              <div className="text-slate-400">→</div>
              <div className="flex-1 bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-100 font-bold">
                {log.newValue}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTimeline;
