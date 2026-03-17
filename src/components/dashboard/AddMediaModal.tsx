'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Media, Project } from '@/lib/types';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';
import Input from '../ui/Input';
import { Car, FileText } from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaData: Omit<Media, 'id'>) => void;
  project: Project;
}

const PHOTO_TYPES = [
  { value: 'Vehicle', label: 'Vehicle & progress', description: 'Car photos, before/after, work in progress', icon: Car },
  { value: 'Invoices', label: 'Paperwork & invoices', description: 'Supplier invoices, receipts, documents', icon: FileText },
] as const;

export default function AddMediaModal({ isOpen, onClose, onSave, project }: AddMediaModalProps) {
  void project; // kept for API; modal uses Vehicle/Invoices types only
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>('Vehicle');

  const handleSave = () => {
    if (!base64Image || !caption.trim()) {
      alert('Please upload an image and add a caption.');
      return;
    }
    onSave({
      url: base64Image,
      caption: caption.trim(),
      category,
    });
    handleClose();
  };

  const handleClose = () => {
    setBase64Image(null);
    setCaption('');
    setCategory('Vehicle');
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
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative bg-white border border-[var(--border-light)] w-full max-w-lg rounded-[var(--radius-lg)] shadow-[var(--shadow-large)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border-light)]">
              <h2 className="text-title text-[var(--shark)]">Add photo</h2>
              <p className="text-caption text-[var(--system-gray)] mt-1">
                Vehicle progress or supplier paperwork. Choose the type then upload.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--shark)] mb-2">Photo type</label>
                <div className="grid grid-cols-2 gap-3">
                  {PHOTO_TYPES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCategory(opt.value)}
                      className={`flex flex-col items-center gap-1 p-4 rounded-[var(--radius-md)] border-2 text-left transition-samsung ${
                        category === opt.value
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border-light)] hover:border-[var(--border)] hover:bg-[var(--athens-gray)]'
                      }`}
                    >
                      <opt.icon className={`h-6 w-6 shrink-0 ${category === opt.value ? 'text-[var(--primary)]' : 'text-[var(--system-gray)]'}`} />
                      <span className="font-medium text-sm text-[var(--shark)]">{opt.label}</span>
                      <span className="text-xs text-[var(--system-gray)]">{opt.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {base64Image ? (
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-[var(--radius-md)] overflow-hidden bg-[var(--athens-gray)] border border-[var(--border-light)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={base64Image} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--shark)] mb-1">Caption</label>
                    <Input
                      placeholder={category === 'Invoices' ? 'e.g. Supplier invoice – suspension parts' : 'e.g. Front bumper fitted'}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <ImageUploader onUploadComplete={setBase64Image} label="Take or upload photo" />
              )}
            </div>

            <div className="p-4 bg-[var(--athens-gray)] flex justify-end gap-2 rounded-b-[var(--radius-lg)]">
              <Button onClick={handleClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} size="sm" disabled={!base64Image || !caption.trim()}>
                Save photo
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
