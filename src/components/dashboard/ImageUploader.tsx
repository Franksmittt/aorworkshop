// [path]: src/components/dashboard/ImageUploader.tsx

'use client';

import { useState, useRef } from 'react';
import { Camera, UploadCloud, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

interface ImageUploaderProps {
  onUploadComplete: (base64Image: string) => void;
}

const ImageUploader = ({ onUploadComplete }: ImageUploaderProps) => {
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
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
      setIsLoading(false);
    };
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        capture="environment" // This is key: it tells mobile devices to open the camera
      />
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-400">Processing Image...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Camera className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Capture Progress</h3>
          {/* --- FIX IS ON THIS LINE --- */}
          <p className="text-sm text-gray-500 mb-4">Tap the button to open your device&apos;s camera or select a photo.</p>
          <Button onClick={triggerFileInput} variant="secondary">
            <UploadCloud className="h-5 w-5 mr-2" />
            Take or Upload Photo
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;