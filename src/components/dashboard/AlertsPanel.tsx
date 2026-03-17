// [path]: components/dashboard/AlertsPanel.tsx

import { AlertTriangle, MessageSquare, Clock } from 'lucide-react';
import React from 'react';

interface AlertItemProps {
  icon: React.ElementType;
  text: string;
  subtext: string;
  color: keyof typeof colorMap;
}

// OPTIMIZED: Created a mapping for styles to ensure Tailwind CSS's JIT compiler
// reliably detects the classes.
const colorMap = {
  blue: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  purple: {
    bg: 'bg-purple-900/50',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  red: {
    bg: 'bg-red-900/50',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
};

const AlertItem = ({ icon: Icon, text, subtext, color }: AlertItemProps) => {
  const styles = colorMap[color];
  return (
    // Updated AlertItem to a dark theme
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.bg} ${styles.border}`}>
        <Icon className={`h-5 w-5 ${styles.text}`} />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-200">{text}</p>
        <p className="text-xs text-gray-500">{subtext}</p>
      </div>
    </div>
  );
};

const AlertsPanel = () => {
  // This is mock data for demonstration.
  const alerts: AlertItemProps[] = [
    { icon: AlertTriangle, text: 'Mustang project is 2 weeks overdue', subtext: 'Chassis & Suspension', color: 'red' },
    { icon: MessageSquare, text: 'New comment from Jane Jones', subtext: '1969 Camaro SS', color: 'blue' },
    { icon: Clock, text: 'Upcoming Delivery: Dodge Charger', subtext: 'Scheduled for next Friday', color: 'purple' },
  ];

  return (
    // Updated Panel to a dark theme
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4">Alerts & Notifications</h3>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <AlertItem key={index} {...alert} />
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;