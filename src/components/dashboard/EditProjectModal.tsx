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
  const [numberPlate, setNumberPlate] = useState(project.car.numberPlate ?? '');

  useEffect(() => {
    if (project) {
      setCustomerName(project.customerName);
      setCarYear(project.car.year.toString());
      setCarMake(project.car.make);
      setCarModel(project.car.model);
      setNumberPlate(project.car.numberPlate ?? '');
    }
  }, [project]);

  const handleSave = () => {
    onSave({
      customerName,
      car: {
        year: parseInt(carYear) || 0,
        make: carMake,
        model: carModel,
        numberPlate: numberPlate.trim() || undefined,
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
            className="relative bg-white border border-[var(--border-light)] w-full max-w-lg rounded-[var(--radius-lg)] shadow-[var(--shadow-large)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-title text-[var(--shark)]">Edit project</h2>
              <p className="text-caption text-[var(--system-gray)] mt-1">Update customer and vehicle details.</p>
            </div>
            <div className="p-6 border-t border-[var(--border-light)] space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--shark)]">Customer name</label>
                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--shark)]">Year</label>
                  <Input type="number" value={carYear} onChange={e => setCarYear(e.target.value)} className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[var(--shark)]">Make</label>
                  <Input value={carMake} onChange={e => setCarMake(e.target.value)} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--shark)]">Model</label>
                <Input value={carModel} onChange={e => setCarModel(e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--shark)]">Number plate</label>
                <Input value={numberPlate} onChange={e => setNumberPlate(e.target.value)} placeholder="e.g. ABC 123 GP" className="mt-1" />
              </div>
            </div>
            <div className="p-4 bg-[var(--athens-gray)] flex justify-end gap-2 rounded-b-[var(--radius-lg)]">
              <Button onClick={onClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} size="sm">Save changes</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProjectModal;