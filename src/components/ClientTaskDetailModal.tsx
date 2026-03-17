// [path]: components/ClientTaskDetailModal.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SubTask } from '@/lib/types';
import { X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ClientTaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: SubTask | null;
}

const ClientTaskDetailModal = ({ isOpen, onClose, task }: ClientTaskDetailModalProps) => {
  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative bg-gray-800 border border-white/10 w-full max-w-3xl rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{task.name}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Before Image */}
                <div>
                  <h3 className="font-semibold text-white mb-2">Before</h3>
                  {task.beforeImageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-700">
                      <Image src={task.beforeImageUrl} alt={`Before shot for ${task.name}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-gray-700 flex items-center justify-center text-gray-500"><ImageIcon className="h-8 w-8"/></div>
                  )}
                </div>
                
                {/* After Image */}
                <div>
                  <h3 className="font-semibold text-white mb-2">After</h3>
                  {task.afterImageUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-700">
                      <Image src={task.afterImageUrl} alt={`After shot for ${task.name}`} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-lg bg-gray-700 flex items-center justify-center text-gray-500"><ImageIcon className="h-8 w-8"/></div>
                  )}
                </div>
              </div>
              
              {task.technicianNotes && (
                <div className="mt-6">
                  <h3 className="font-semibold text-white mb-2">Technician&apos;s Note</h3>
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300 italic">{`"${task.technicianNotes}"`}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientTaskDetailModal;