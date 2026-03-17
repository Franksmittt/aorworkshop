// [path]: components/dashboard/JobCardModal.tsx

'use client';

import { AssignedTask } from '@/lib/types'; // CORRECTED: Removed unused 'User' import
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wrench, MessageSquare, Timer, Square, Play, Send } from 'lucide-react';
import Button from '../ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/AuthContext';

interface JobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: AssignedTask | null;
  activeTimerTaskId: string | null;
  timerStartTime: number | null;
  onStartTimer: (task: AssignedTask) => void;
  onStopTimer: () => void;
  onStatusChange: (taskId: string, categoryId: string, newStatus: AssignedTask['status']) => void;
  onAddNote: (taskId: string, categoryId: string, noteText: string) => void;
}

const JobCardModal = ({ isOpen, onClose, task, activeTimerTaskId, timerStartTime, onStartTimer, onStopTimer, onStatusChange, onAddNote }: JobCardModalProps) => {
  const { user } = useAuth();
  const [elapsedTime, setElapsedTime] = useState('00:00:00');
  const [noteText, setNoteText] = useState('');
  const isTimerActiveForThisTask = task ? activeTimerTaskId === task.id : false;

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerActiveForThisTask && timerStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - timerStartTime;
        const hours = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        setElapsedTime(`${hours}:${minutes}:${seconds}`);
      }, 1000);
    } else {
        setElapsedTime('00:00:00');
    }
    return () => clearInterval(interval);
  }, [isTimerActiveForThisTask, timerStartTime]);

  if (!task) return null;

  const handleNoteSubmit = () => {
    if (!noteText.trim() || !user) return;
    onAddNote(task.id, task.categoryName, noteText);
    setNoteText('');
  };

  const managerNotes = task.internalNotes?.filter(n => n.type === 'Instruction') || [];
  const technicianLogs = task.internalNotes?.filter(n => n.type === 'Log') || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-gray-800 border border-white/10 w-full max-w-2xl rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 bg-gray-900/50 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{task.name}</h2>
                <p className="text-sm text-red-400">{task.projectName} - ({task.categoryName})</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-white mb-4">Task Status: <span className="text-yellow-400">{task.status}</span></h3>
                <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={() => onStatusChange(task.id, task.categoryName, 'Pending')} disabled={task.status === 'Pending'}>Set to Pending</Button>
                    <Button size="sm" variant="secondary" onClick={() => onStatusChange(task.id, task.categoryName, 'In Progress')} disabled={task.status === 'In Progress'}>Set In Progress</Button>
                    <Button size="sm" variant="secondary" onClick={() => onStatusChange(task.id, task.categoryName, 'Awaiting Approval')} disabled={task.status === 'Awaiting Approval'}>Request Approval</Button>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg">
                 <h3 className="font-semibold text-lg text-white mb-4 flex items-center"><Timer className="mr-3 h-5 w-5 text-green-400"/>Time Tracking</h3>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-400">Estimated Hours: <span className="font-bold text-white">{task.estimateHours || 'N/A'}</span></p>
                        <p className="text-sm text-gray-400">Actual Hours Logged: <span className="font-bold text-white">{task.actualHours?.toFixed(2) || '0.00'}</span></p>
                    </div>
                    {isTimerActiveForThisTask ? (
                        <div className="text-center">
                            <p className="text-2xl font-mono font-bold text-green-400">{elapsedTime}</p>
                            <Button onClick={onStopTimer} variant="secondary" size="sm" className="bg-red-900/80 text-red-300 w-full mt-2"><Square className="w-4 h-4 mr-2"/>Stop Timer</Button>
                        </div>
                    ) : (
                        <Button onClick={() => onStartTimer(task)} variant="primary" size="sm" disabled={!!activeTimerTaskId}><Play className="w-4 h-4 mr-2"/>Start Timer</Button>
                    )}
                 </div>
              </div>

              {task.parts && task.parts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-white mb-2 flex items-center"><Wrench className="mr-3 h-5 w-5 text-blue-400"/>Parts Required</h3>
                  <ul className="space-y-2 bg-gray-900/50 p-4 rounded-lg">
                    {task.parts.map(part => (
                      <li key={part.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{part.name} (x{part.qty})</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${part.status === 'Received' ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'}`}>{part.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg text-white mb-2 flex items-center"><MessageSquare className="mr-3 h-5 w-5 text-yellow-400"/>Job Notes & Logs</h3>
                 <div className="bg-gray-900/50 p-4 rounded-lg text-sm text-gray-300 space-y-4">
                   {managerNotes.length > 0 && <div><p className="font-bold text-gray-400 text-xs uppercase mb-1">Manager Instructions</p>{managerNotes.map(note => (<p key={note.id}>- {note.note}</p>))}</div>}
                   {technicianLogs.length > 0 && <div><p className="font-bold text-gray-400 text-xs uppercase mb-1">Technician Logs</p>{technicianLogs.map(note => (<p key={note.id}>- {note.note} <span className="text-gray-500">({note.authorName})</span></p>))}</div>}
                   <div className="flex space-x-2 pt-2 border-t border-gray-700">
                    <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a log or note..." className="flex-grow bg-gray-700 border-gray-600 rounded-md text-white placeholder-gray-400 text-sm p-2 focus:ring-red-500 focus:border-red-500"/>
                    <Button onClick={handleNoteSubmit} variant="primary" size="sm" disabled={!noteText.trim()}><Send className="w-4 h-4"/></Button>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobCardModal;