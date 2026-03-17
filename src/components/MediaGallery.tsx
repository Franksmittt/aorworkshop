// [path]: components/MediaGallery.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Media } from '@/lib/types';
import { X } from 'lucide-react';

interface MediaGalleryProps {
  media: Media[];
  categories: string[];
}

const MediaGallery = ({ media, categories }: MediaGalleryProps) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredMedia = activeFilter === 'All' 
    ? media 
    : media.filter(item => item.category === activeFilter);

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6">Media Gallery</h2>
      
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveFilter('All')}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            activeFilter === 'All' 
               ? 'bg-red-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeFilter === category 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredMedia.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              // --- FIX: Replaced 'aspect-w-16 aspect-h-9' with 'aspect-video' ---
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(item.url)}
            >
              <Image
                src={item.url}
                alt={item.caption}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={selectedImage}
              className="relative w-full max-w-4xl max-h-[90vh]"
            >
              <Image
                src={selectedImage}
                alt="Selected restoration image"
                width={1200}
                height={800}
                className="object-contain w-full h-full"
              />
            </motion.div>
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-4 right-4 text-white hover:text-red-500"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaGallery;