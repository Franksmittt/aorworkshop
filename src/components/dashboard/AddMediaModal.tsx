// [path]: components/dashboard/AddMediaModal.tsx

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Media, Project } from '@/lib/types';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';
import Image from 'next/image';
import Input from '../ui/Input';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaData: Omit<Media, 'id'>) => void;
  project: Project;
}

const AddMediaModal = ({ isOpen, onClose, onSave, project }: AddMediaModalProps) => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(project.categories[0]?.name || '');

  const handleSave = () => {
    if (!base64Image || !caption || !category) {
      alert('Please upload an image and fill out all fields.');
      return;
    }
    onSave({
      url: base64Image,
      caption,
      category,
    });
    handleClose();
  };

  const handleClose = () => {
    setBase64Image(null);
    setCaption('');
    setCategory(project.categories[0]?.name || '');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-gray-800 border border-white/10 w-full max-w-2xl rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Add Photo to Project</h2>
              <p className="text-sm text-gray-400">This image will be added to the media gallery.</p>
            </div>
            
            <div className="p-6 space-y-4">
              {base64Image ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-700">
                    <Image src={base64Image} alt="Uploaded preview" fill className="object-contain" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Caption</label>
                    <Input placeholder="e.g., Engine bay after degreasing." value={caption} onChange={e => setCaption(e.target.value)} className="mt-1" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm text-white p-2">
                      {project.categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <ImageUploader onUploadComplete={setBase64Image} />
              )}
            </div>
            
            <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
              <Button onClick={handleClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} variant="primary" size="sm" disabled={!base64Image}>Save Photo</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMediaModal;