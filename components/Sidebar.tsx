
import React from 'react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, currentUser, setCurrentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'upload', label: 'Upload Data', icon: '📁' },
    { id: 'reconciliation', label: 'Reconciliation', icon: '⚖️' },
    { id: 'audit', label: 'Audit Trail', icon: '📜' },
  ];

  const roles: UserRole[] = [UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">S</div>
          <span className="text-xl font-bold text-white tracking-tight">SmartRecon</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Switch Role (Dev)</label>
        <select 
          className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          value={currentUser.role}
          onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as UserRole })}
        >
          {roles.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;
