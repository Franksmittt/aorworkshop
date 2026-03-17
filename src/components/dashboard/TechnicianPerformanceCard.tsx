// [path]: src/components/dashboard/TechnicianPerformanceCard.tsx

'use client';

import { Clock, CheckSquare, Briefcase, Percent, Edit, Trash2, LucideIcon } from 'lucide-react';
import Button from '../ui/Button';

interface PerformanceStats {
  technicianId: string;
  name: string;
  tasksCompleted: number;
  taskHours: number;
  shiftHours: number;
  utilization: number;
  currentStatus: {
    Icon: LucideIcon;
    text: string;
    color: string;
    subtext?: string;
  };
}

interface TechnicianPerformanceCardProps {
  technicianStats: PerformanceStats;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const TechnicianPerformanceCard = ({ technicianStats, onEdit, onDelete, onClick }: TechnicianPerformanceCardProps) => {
  const { currentStatus } = technicianStats;
  const isClickable = !!onClick;
  const isEditable = !!onEdit && !!onDelete;

  return (
    <div 
      onClick={onClick}
      className={`bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft flex flex-col justify-between ${isClickable ? 'cursor-pointer transition-all hover:-translate-y-1 hover:border-red-500/50' : ''}`}
    >
      <div>
        <h3 className="font-bold text-xl text-white mb-2">{technicianStats.name}</h3>
        
        {currentStatus && (
          <div className="mb-4 p-3 bg-gray-900/50 rounded-md">
            <div className="flex items-center">
              <currentStatus.Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${currentStatus.color}`} />
              <div>
                <p className="font-semibold text-white text-sm">{currentStatus.text}</p>
                {currentStatus.subtext && <p className="text-xs text-gray-400">{currentStatus.subtext}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-gray-400"><Briefcase className="h-4 w-4 mr-2 text-gray-500"/>Shift Hours</span>
              <span className="font-bold text-white">{technicianStats.shiftHours.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-gray-400"><Clock className="h-4 w-4 mr-2 text-blue-400"/>Task Hours</span>
              <span className="font-bold text-white">{technicianStats.taskHours.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
              <span className="flex items-center text-sm text-gray-400"><CheckSquare className="h-4 w-4 mr-2 text-green-400"/>Tasks Completed</span>
              <span className="font-bold text-white">{technicianStats.tasksCompleted}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <span className="flex items-center text-sm font-semibold text-gray-200"><Percent className="h-4 w-4 mr-2 text-yellow-400"/>Utilization</span>
              <span className="font-bold text-lg text-yellow-400">{technicianStats.utilization.toFixed(0)}%</span>
          </div>
        </div>
      </div>
      {isEditable && (
        <div className="flex items-center space-x-2 mt-6">
          <Button onClick={onEdit} variant="secondary" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              Edit
          </Button>
          <Button onClick={onDelete} variant="outline" size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default TechnicianPerformanceCard;