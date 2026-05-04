'use client';

import { useState, useMemo } from 'react';
import { mockProjects } from '@/lib/mock-data';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function MediaPage() {
  const allMedia = useMemo(() => 
    mockProjects.flatMap(project => 
      project.media.map(mediaItem => ({
        ...mediaItem,
        projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
        projectId: project.id
      }))
    ), 
  []);

  const allCategories = useMemo(() => 
    ['All Categories', ...Array.from(new Set(allMedia.map(item => item.category)))], 
  [allMedia]);

  const [selectedProject, setSelectedProject] = useState('All Projects');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredMedia = allMedia.filter(item => {
    const projectMatch = selectedProject === 'All Projects' || item.projectId === selectedProject;
    const categoryMatch = selectedCategory === 'All Categories' || item.category === selectedCategory;
    return projectMatch && categoryMatch;
  });

  return (
    <>
      <div className="mb-8">
        {/* Text colors reverted for dark background */}
        <h1 className="text-3xl font-bold text-white">Global Media Library</h1>
        <p className="text-gray-400">View and filter all photos from all projects.</p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-800 border border-white/10 rounded-lg shadow-soft">
        <div>
          <label htmlFor="project-filter" className="block text-sm font-medium text-gray-300">Filter by Project</label>
          <select
            id="project-filter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="mt-1 block w-full sm:w-64 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            <option>All Projects</option>
            {mockProjects.map(p => <option key={p.id} value={p.id}>{`${p.car.year} ${p.car.make} ${p.car.model}`}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-300">Filter by Category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full sm:w-64 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
          >
            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMedia.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-soft"
            onClick={() => setSelectedImage(item.url)}
          >
            <Image
              src={item.url}
              alt={item.caption}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-xs font-semibold truncate">{item.projectName}</p>
              <p className="text-gray-300 text-xs truncate">{item.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
       {filteredMedia.length === 0 && (
        <div className="text-center py-16 bg-gray-800 rounded-lg">
          <p className="text-gray-500">No photos match the selected filters.</p>
        </div>
      )}


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
              className="relative w-full max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt="Selected restoration image"
                width={1200}
                height={800}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '90vh' }}
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
    </>
  );
}