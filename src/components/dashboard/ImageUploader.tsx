'use client';

import { useState, useRef } from 'react';
import { Camera, UploadCloud, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

interface ImageUploaderProps {
  onUploadComplete: (base64Image: string) => void;
  label?: string;
}

const ImageUploader = ({ onUploadComplete, label = 'Take or upload photo' }: ImageUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onUploadComplete(reader.result as string);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsLoading(false);
    };
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)] p-8 text-center bg-[var(--athens-gray)]/50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="environment"
      />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-[var(--primary)] animate-spin mb-4" />
          <p className="text-[var(--system-gray)]">Processing image…</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Camera className="h-12 w-12 text-[var(--primary)] mb-4" />
          <h3 className="text-headline text-[var(--shark)] mb-2">Capture progress</h3>
          <p className="text-caption text-[var(--system-gray)] mb-4">
            Use the button to open the camera or select a photo from your device.
          </p>
          <Button onClick={triggerFileInput} variant="secondary">
            <UploadCloud className="h-5 w-5 mr-2" />
            {label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
