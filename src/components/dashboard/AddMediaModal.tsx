'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Media, Project } from '@/lib/types';
import Button from '../ui/Button';
import ImageUploader from './ImageUploader';
import Input from '../ui/Input';
import { Car } from 'lucide-react';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (mediaData: Omit<Media, 'id'>) => void;
  project: Project;
}

export default function AddMediaModal({ isOpen, onClose, onSave, project }: AddMediaModalProps) {
  void project;
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const category = 'Vehicle' as const;

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
                Progress, condition, or marketing shots for this job.
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 rounded-[var(--radius-md)] border-2 border-[var(--primary)] bg-[var(--primary)]/5 p-4">
                <Car className="h-6 w-6 shrink-0 text-[var(--primary)]" />
                <div>
                  <span className="font-medium text-sm text-[var(--shark)]">Vehicle &amp; progress</span>
                  <p className="text-xs text-[var(--system-gray)] mt-0.5">Stored with this project&apos;s media gallery.</p>
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
                      placeholder="e.g. Rear leaf pack removed — before new EFS shocks"
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
              <Button onClick={handleClose} variant="secondary" size="sm">
                Cancel
              </Button>
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
