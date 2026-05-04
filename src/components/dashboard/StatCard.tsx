// [path]: components/dashboard/StatCard.tsx

import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: number | string;
  colorClass: string;
  // --- NEW: Add an optional onClick handler ---
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, title, value, colorClass, onClick }: StatCardProps) => (
  // --- NEW: Added onClick, cursor-pointer, and transition styles ---
  <div 
    onClick={onClick}
    className={`bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft flex items-center transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-red-500/50 hover:bg-gray-700/50' : ''}`}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClass}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default StatCard;