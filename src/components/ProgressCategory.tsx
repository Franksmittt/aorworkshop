// [path]: components/ProgressCategory.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import { Category, SubTask } from '@/lib/types';
import ProgressBar from './ui/ProgressBar';

interface ProgressCategoryProps {
  category: Category;
  onTaskClick: (task: SubTask) => void;
}

const ProgressCategory = ({ category, onTaskClick }: ProgressCategoryProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const completedTasks = category.subTasks.filter(task => task.status === 'Completed').length;
  const totalTasks = category.subTasks.length;
  const categoryProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-white/10 shadow-soft overflow-hidden rounded-lg"
    >
      <motion.header
        initial={false}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-100">{category.name}</h3>
            <span className="text-sm font-medium text-gray-400">{`${completedTasks}/${totalTasks} tasks`}</span>
          </div>
          <ProgressBar progress={categoryProgress} />
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4"
        >
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </motion.div>
      </motion.header>
      
      <AnimatePresence>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{ open: { opacity: 1, height: 'auto' }, collapsed: { opacity: 0, height: 0 } }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="px-4 pb-4"
          >
            <ul className="space-y-3 pt-4 border-t border-white/10">
              {category.subTasks.map(task => (
                <li 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className={`flex items-center p-2 rounded-md transition-colors cursor-pointer hover:bg-gray-800/50 ${task.requiresClientApproval && task.status !== 'Completed' ? 'bg-blue-900/50' : ''}`}
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-600 mr-3 flex-shrink-0" />
                  )}
                  <span className={`text-gray-300 ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                    {task.name}
                  </span>
                  {task.requiresClientApproval && task.status !== 'Completed' && (
                    <span className="ml-auto flex items-center text-xs font-semibold text-blue-300 bg-blue-900 px-2 py-1 rounded-full">
                        <HelpCircle className="h-3 w-3 mr-1.5" />
                        Decision Needed
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProgressCategory;