'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
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
            className="relative bg-gray-800 border border-white/10 w-full max-w-md rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-start">
                <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-4 text-left">
                    <h3 className="text-lg font-semibold leading-6 text-white">{title}</h3>
                    <p className="mt-2 text-sm text-gray-400">{message}</p>
                </div>
            </div>

            <div className="mt-2 p-4 bg-gray-900/50 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 rounded-b-lg">
              <Button onClick={onClose} variant="secondary" size="sm" className="mt-3 w-full sm:w-auto sm:mt-0">
                Cancel
              </Button>
              <Button onClick={onConfirm} variant="primary" size="sm" className="w-full sm:w-auto">
                Confirm
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;