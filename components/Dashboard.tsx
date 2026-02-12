
import React, { useMemo, useState } from 'react';
import { TransactionRecord, MatchStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface DashboardProps {
  systemRecords: TransactionRecord[];
  uploadedRecords: TransactionRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ systemRecords, uploadedRecords }) => {
  const [filter, setFilter] = useState({
    status: 'All',
    dateRange: 'All'
  });

  const stats = useMemo(() => {
    const total = uploadedRecords.length;
    const matched = uploadedRecords.filter(r => r.status === MatchStatus.MATCHED).length;
    const partial = uploadedRecords.filter(r => r.status === MatchStatus.PARTIAL).length;
    const unmatched = uploadedRecords.filter(r => r.status === MatchStatus.UNMATCHED).length;
    const duplicates = uploadedRecords.filter(r => r.status === MatchStatus.DUPLICATE).length;
    
    return {
      total,
      matched,
      partial,
      unmatched,
      duplicates,
      accuracy: total > 0 ? ((matched + partial) / total * 100).toFixed(1) : 0
    };
  }, [uploadedRecords]);

  const chartData = [
    { name: 'Matched', value: stats.matched, color: '#10b981' },
    { name: 'Partial', value: stats.partial, color: '#f59e0b' },
    { name: 'Unmatched', value: stats.unmatched, color: '#ef4444' },
    { name: 'Duplicates', value: stats.duplicates, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
        <span className="text-sm font-semibold text-slate-500">Filters:</span>
        <select 
          className="border rounded-lg px-3 py-1.5 text-sm outline-none"
          value={filter.status}
          onChange={(e) => setFilter({...filter, status: e.target.value})}
        >
          <option>All Statuses</option>
          <option>Matched</option>
          <option>Unmatched</option>
        </select>
        <select 
          className="border rounded-lg px-3 py-1.5 text-sm outline-none"
          value={filter.dateRange}
          onChange={(e) => setFilter({...filter, dateRange: e.target.value})}
        >
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Total Uploaded" value={stats.total} icon="📑" color="blue" />
        <StatCard label="Fully Matched" value={stats.matched} icon="✅" color="emerald" />
        <StatCard label="Unmatched" value={stats.unmatched} icon="❌" color="rose" />
        <StatCard label="Duplicates" value={stats.duplicates} icon="👯" color="violet" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon="🎯" color="amber" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Reconciliation Breakdown</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Weekly Performance</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { day: 'Mon', count: 120 },
                { day: 'Tue', count: 210 },
                { day: 'Wed', count: 150 },
                { day: 'Thu', count: 320 },
                { day: 'Fri', count: 280 },
              ]}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) => {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
    </div>
  );
};

export default Dashboard;
