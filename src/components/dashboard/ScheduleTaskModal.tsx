// [path]: components/dashboard/ScheduleTaskModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Technician, UnscheduledTask } from '@/lib/types';
import Button from '../ui/Button';
import { mockTechnicians } from '@/lib/mock-data';

interface ScheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: UnscheduledTask | null;
  onSave: (taskId: string, details: { startDate: string; dueDate: string; assignedTo: string }) => void;
  defaults?: { startDate: string; assignedTo: string } | null;
}

const ScheduleTaskModal = ({ isOpen, onClose, task, onSave, defaults }: ScheduleTaskModalProps) => {
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    setTechnicians(mockTechnicians);
    if (task) {
      setStartDate(defaults?.startDate || '');
      setDueDate('');
      setAssignedTo(defaults?.assignedTo || '');
    }
  }, [task, defaults]);

  const handleSave = () => {
    if (!task || !startDate || !dueDate || !assignedTo) {
      alert('Please fill out all fields.');
      return;
    }
    onSave(task.id, { startDate, dueDate, assignedTo });
    onClose();
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gray-800 border border-white/10 w-full max-w-lg rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
               <h2 className="text-xl font-bold text-white">Schedule Task: {task.name}</h2>
              <p className="text-sm text-gray-400 mt-1">Assign dates and a technician to this task.</p>
            </div>
            
            <div className="p-6 border-t border-gray-700 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300">Start Date</label>
                  <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-white p-2" />
                </div>
                 <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300">Due Date</label>
                  <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-white p-2" />
                </div>
              </div>
               <div>
                <label htmlFor="technician" className="block text-sm font-medium text-gray-300">Assign To</label>
                <select id="technician" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-white p-2">
                  <option value="">Select Technician...</option>
                   {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
             <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
              <Button onClick={onClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} variant="primary" size="sm">Save Schedule</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleTaskModal;