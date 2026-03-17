// [path]: src/components/dashboard/TechnicianDetailModal.tsx

'use client';

import { Project, SubTask } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckSquare, Circle, Construction, LucideIcon } from 'lucide-react';
import { useMemo } from 'react';
import Link from 'next/link';
import { startOfWeek, startOfMonth, parseISO } from 'date-fns';

type TimeRange = 'This Week' | 'This Month' | 'All Time';

// This is the PerformanceStats type from the page, now used here for consistency
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

interface TechnicianDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: PerformanceStats | null; // MODIFIED: Expect the full PerformanceStats object
  projects: Project[];
  timeRange: TimeRange;
}

const getStatusIndicator = (status: SubTask['status']) => {
    switch(status) {
        case 'Awaiting Approval': return { Icon: Clock, color: 'text-yellow-400' };
        case 'In Progress': return { Icon: Construction, color: 'text-blue-400' };
        default: return { Icon: Circle, color: 'text-gray-500' };
    }
};

const TechnicianDetailModal = ({ isOpen, onClose, technician, projects, timeRange }: TechnicianDetailModalProps) => {
  const taskDetails = useMemo(() => {
    if (!technician) return { completed: [], current: [] };

    const now = new Date();
    let startDate: Date;
    if (timeRange === 'This Week') startDate = startOfWeek(now, { weekStartsOn: 1 });
    else if (timeRange === 'This Month') startDate = startOfMonth(now);
    else startDate = new Date(0);

    const completed: (SubTask & { projectName: string, projectId: string })[] = [];
    const current: (SubTask & { projectName: string, projectId: string })[] = [];

    projects.forEach(project => {
      project.categories.forEach(category => {
        category.subTasks.forEach(task => {
          // MODIFIED: Filter using technicianId, which correctly matches the task's assignedTo ID
          if (task.assignedTo === technician.technicianId) {
            const taskWithContext = { ...task, projectName: `${project.car.year} ${project.car.make} ${project.car.model}`, projectId: project.id };
            if (task.status === 'Completed' && task.completedAt && parseISO(task.completedAt) >= startDate) {
               completed.push(taskWithContext);
            } else if (task.status !== 'Completed') {
              current.push(taskWithContext);
            }
          }
        });
      });
    });
    
    return { completed, current };
  }, [technician, projects, timeRange]);

  if (!technician) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gray-800 border border-white/10 w-full max-w-4xl rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Activity Deep Dive: {technician.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-white mb-3 flex items-center"><CheckSquare className="mr-3 h-5 w-5 text-green-400"/>Completed ({timeRange})</h3>
                <div className="space-y-2">
                  {taskDetails.completed.length > 0 ? taskDetails.completed.map(task => (
                    <div key={task.id} className="bg-gray-900/50 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-300">{task.name}</p>
                        <p className="text-sm font-bold text-white">{task.actualHours?.toFixed(2) || '0'} hrs</p>
                      </div>
                      <Link href={`/dashboard/projects/${task.projectId}`} className="text-xs text-red-500 hover:underline">{task.projectName}</Link>
                    </div>
                  )) : <p className="text-sm text-gray-500 italic">No tasks completed in this period.</p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg text-white mb-3 flex items-center"><Clock className="mr-3 h-5 w-5 text-blue-400"/>Current Workload</h3>
                <div className="space-y-2">
                  {taskDetails.current.length > 0 ? taskDetails.current.map(task => {
                      const { Icon, color } = getStatusIndicator(task.status);
                      return (
                        <div key={task.id} className="bg-gray-900/50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-300">{task.name}</p>
                            <div className="flex justify-between items-center mt-1">
                                <Link href={`/dashboard/projects/${task.projectId}`} className="text-xs text-red-500 hover:underline">{task.projectName}</Link>
                                <span className={`inline-flex items-center text-xs font-semibold ${color}`}>
                                    <Icon className="h-3 w-3 mr-1.5" />
                                    {task.status}
                                </span>
                            </div>
                        </div>
                      );
                   }) : <p className="text-sm text-gray-500 italic">No active tasks assigned.</p>}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TechnicianDetailModal;