// [path]: components/dashboard/TechnicianFormModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Technician } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface TechnicianFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (technicianData: Partial<Technician>) => void;
  technician: Technician | null;
}

const TechnicianFormModal = ({ isOpen, onClose, onSave, technician }: TechnicianFormModalProps) => {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  useEffect(() => {
    if (isOpen && technician) {
      setName(technician.name);
      setHourlyRate(technician.hourlyRate?.toString() || '');
    } else if (isOpen && !technician) {
      // Reset for new entry
      setName('');
      setHourlyRate('');
    }
  }, [isOpen, technician]);

  const handleSave = () => {
    if (!name) {
      alert('Technician name is required.');
      return;
    }
    onSave({
      id: technician?.id,
      name,
      hourlyRate: parseFloat(hourlyRate) || 0,
    });
    onClose();
  };

  const modalTitle = technician ? 'Edit Technician' : 'Add New Technician';

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
            className="relative bg-gray-800 border border-white/10 w-full max-w-lg rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
            </div>
            
            <div className="p-6 border-t border-gray-700 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <Input placeholder="e.g., John Smith" value={name} onChange={e => setName(e.target.value)} className="mt-1" required />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Hourly Rate (ZAR)</label>
                <Input type="number" placeholder="e.g., 450" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="mt-1" required />
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
              <Button onClick={onClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} variant="primary" size="sm">Save Changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TechnicianFormModal;