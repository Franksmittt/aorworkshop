// [path]: components/dashboard/InteractiveProgressCategory.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, HelpCircle, Clock, Construction, ShieldCheck, ShieldAlert, PlusCircle, Wrench } from 'lucide-react';
import { Category, Technician, SubTask, Part } from '@/lib/types'; // <-- ADD Part
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

interface InteractiveProgressCategoryProps {
  category: Category;
  technicians: Technician[];
  onTaskToggle: (taskId: string, categoryId: string) => void;
  onTaskAssign: (taskId:string, categoryId: string, techId: string) => void;
  onToggleApproval: (taskId: string, categoryId: string) => void;
  onQaStatusChange: (categoryId: string, qaPassed: boolean) => void;
  onAddPartClick: (taskId: string, categoryId: string) => void; // <-- NEW PROP
}

const InteractiveProgressCategory = ({ category, technicians, onTaskToggle, onTaskAssign, onToggleApproval, onQaStatusChange, onAddPartClick }: InteractiveProgressCategoryProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const completedTasks = category.subTasks.filter(task => task.status === 'Completed').length;
  const totalTasks = category.subTasks.length;
  const categoryProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const isReadyForQa = category.requiresQa && completedTasks === totalTasks;

  const getStatusIcon = (status: SubTask['status']) => {
    switch(status) {
        case 'Completed': return <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />;
        case 'Awaiting Approval': return <Clock className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />;
        case 'In Progress': return <Construction className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />;
        default: return <Circle className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" />;
    }
  };

  const getPartStatusColor = (status: Part['status']) => {
    switch (status) {
      case 'Received': return 'bg-green-800 text-green-300';
      case 'Ordered': return 'bg-blue-800 text-blue-300';
      default: return 'bg-yellow-800 text-yellow-300';
    }
  };

  return (
    <div className="bg-gray-800 border border-white/10 shadow-soft overflow-hidden rounded-lg">
      <header onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-700/50">
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center">
              {category.name}
              {category.requiresQa && (
                <span title="This category requires QA"><ShieldCheck className="h-4 w-4 text-green-400 ml-2" /></span>
              )}
            </h3>
            <span className="text-sm font-medium text-gray-400">{`${completedTasks}/${totalTasks} tasks`}</span>
          </div>
          <ProgressBar progress={categoryProgress} />
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="ml-4">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </header>
      
      <AnimatePresence>
        {isOpen && (
          <motion.section key="content" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.3, ease: 'easeOut' }} className="pb-4">
            <div className="px-4">
              {isReadyForQa ? (
                <div className="text-center p-4 my-2 border-2 border-dashed border-green-500/50 bg-green-900/30 rounded-lg">
                  <ShieldCheck className="h-10 w-10 text-green-400 mx-auto mb-2" />
                  <h4 className="font-bold text-white">QA Review Pending</h4>
                  <p className="text-sm text-gray-400 mb-4">All tasks are complete. Please review the work.</p>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onQaStatusChange(category.id, false)}><ShieldAlert className="w-4 h-4 mr-2" />Fail QA & Reset Tasks</Button>
                    <Button size="sm" variant="secondary" onClick={() => onQaStatusChange(category.id, true)}><ShieldCheck className="w-4 h-4 mr-2" />Pass QA</Button>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-700 pt-4 border-t border-gray-700">
                  {category.subTasks.map(task => (
                    <li key={task.id} className="py-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div onClick={() => onTaskToggle(task.id, category.id)} className="flex items-center cursor-pointer mb-2 sm:mb-0 flex-grow">
                          {getStatusIcon(task.status)}
                          <span className={`text-gray-300 ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>{task.name}</span>
                        </div>
                        <div className="flex items-center self-end sm:self-center ml-auto pl-4 sm:pl-2">
                          <button onClick={(e) => { e.stopPropagation(); onToggleApproval(task.id, category.id); }} className={`p-1 rounded-full transition-colors mr-2 ${task.requiresClientApproval ? 'bg-blue-900/80 text-blue-300' : 'text-gray-500 hover:bg-gray-700'}`} title="Toggle Client Approval Requirement">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                          <select value={task.assignedTo || ''} onChange={(e) => onTaskAssign(task.id, category.id, e.target.value)} onClick={(e) => e.stopPropagation()} className="text-xs rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500">
                            <option value="">Unassigned</option>
                            {technicians.map(tech => (<option key={tech.id} value={tech.id}>{tech.name}</option>))}
                          </select>
                        </div>
                      </div>
                      {/* --- NEW: Parts section for each task --- */}
                      <div className="pl-8 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center"><Wrench className="h-3 w-3 mr-2" />Parts</h4>
                          <button onClick={() => onAddPartClick(task.id, category.id)} className="flex items-center text-xs text-blue-400 hover:text-blue-300">
                            <PlusCircle className="h-3 w-3 mr-1"/> Add Part
                          </button>
                        </div>
                        {task.parts && task.parts.length > 0 ? (
                          <ul className="mt-2 space-y-1">
                            {task.parts.map(part => (
                              <li key={part.id} className="flex justify-between items-center bg-gray-900/50 p-2 rounded">
                                <span className="text-sm text-gray-300">{part.name} (x{part.qty})</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${getPartStatusColor(part.status)}`}>{part.status}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-gray-500 italic mt-1">No parts assigned to this task.</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveProgressCategory;