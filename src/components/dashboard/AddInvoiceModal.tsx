// [path]: components/dashboard/AddInvoiceModal.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Invoice } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoiceData: Omit<Invoice, 'id' | 'status' | 'dueDate'>) => void;
}

const AddInvoiceModal = ({ isOpen, onClose, onSave }: AddInvoiceModalProps) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    if (!description || !amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }
    onSave({
      description,
      amount: parseFloat(amount),
    });
    // Reset form and close modal
    setDescription('');
    setAmount('');
    onClose();
  };

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
                <h2 className="text-xl font-bold text-white">Add New Invoice</h2>
                {/* CORRECTED: Replaced the apostrophe with &apos; */}
                <p className="text-sm text-gray-400 mt-1">This will be added to the project&apos;s financials.</p>
            </div>
            
            <div className="p-6 border-t border-gray-700 space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Input placeholder="e.g., Custom Parts Sourcing" value={description} onChange={e => setDescription(e.target.value)} className="mt-1" required />
                 </div>
                 <div>
                    <label className="text-sm font-medium text-gray-300">Amount (ZAR)</label>
                    <Input type="number" placeholder="e.g., 15000" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1" required />
                 </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
                <Button onClick={onClose} variant="secondary" size="sm">Cancel</Button>
                <Button onClick={handleSave} variant="primary" size="sm">Save Invoice</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddInvoiceModal;