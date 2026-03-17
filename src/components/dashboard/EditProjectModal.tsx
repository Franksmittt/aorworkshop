'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Project>) => void;
  project: Project;
}

const EditProjectModal = ({ isOpen, onClose, onSave, project }: EditProjectModalProps) => {
  const [customerName, setCustomerName] = useState(project.customerName);
  const [carYear, setCarYear] = useState(project.car.year.toString());
  const [carMake, setCarMake] = useState(project.car.make);
  const [carModel, setCarModel] = useState(project.car.model);

  useEffect(() => {
    if (project) {
        setCustomerName(project.customerName);
        setCarYear(project.car.year.toString());
        setCarMake(project.car.make);
        setCarModel(project.car.model);
    }
  }, [project]);

  const handleSave = () => {
    onSave({
      customerName,
      car: {
        year: parseInt(carYear) || 0,
        make: carMake,
        model: carModel,
      },
    });
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
                <h2 className="text-xl font-bold text-white">Edit Project Details</h2>
                {/* Corrected: Replaced ' with &apos; to fix the linting error */}
                <p className="text-sm text-gray-400 mt-1">Make changes to the project&apos;s core information.</p>
            </div>
            
            <div className="p-6 border-t border-gray-700 space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-300">Customer Name</label>
                    <Input value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1" />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300">Year</label>
                        <Input type="number" value={carYear} onChange={e => setCarYear(e.target.value)} className="mt-1" />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-medium text-gray-300">Make</label>
                        <Input value={carMake} onChange={e => setCarMake(e.target.value)} className="mt-1" />
                    </div>
                 </div>
                 <div>
                    <label className="text-sm font-medium text-gray-300">Model</label>
                    <Input value={carModel} onChange={e => setCarModel(e.target.value)} className="mt-1" />
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

export default EditProjectModal;