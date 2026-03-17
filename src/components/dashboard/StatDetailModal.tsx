// [path]: components/dashboard/StatDetailModal.tsx

'use client';

import { Project } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  projects: Project[];
}

const StatDetailModal = ({ isOpen, onClose, title, projects }: StatDetailModalProps) => {
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
            className="relative bg-gray-800 border border-white/10 w-full max-w-3xl rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-2 max-h-[60vh] overflow-y-auto">
              {projects.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Vehicle</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Details</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm font-medium text-white">{`${p.car.year} ${p.car.make} ${p.car.model}`}</td>
                        <td className="px-4 py-3 text-sm text-gray-300">{p.customerName}</td>
                        <td className="px-4 py-3 text-sm text-yellow-300">{p.holdReason || p.promisedDate || p.status}</td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/dashboard/projects/${p.id}`} onClick={onClose} className="text-red-500 hover:underline text-sm font-semibold">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-10">No projects match this criteria.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatDetailModal;