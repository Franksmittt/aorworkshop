// [path]: components/ui/ViewSwitcher.tsx

'use client';

import { LayoutGrid, List } from 'lucide-react';

type View = 'kanban' | 'list';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  const options: { id: View; icon: React.ElementType }[] = [
    { id: 'kanban', icon: LayoutGrid },
    { id: 'list', icon: List },
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-800 border border-white/10 rounded-lg p-1">
      {options.map(option => (
        <button
          key={option.id}
          onClick={() => onViewChange(option.id)}
          className={`flex items-center justify-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            currentView === option.id
              ? 'bg-red-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          aria-label={`Switch to ${option.id} view`}
        >
          <option.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;