'use client';

import { motion } from 'framer-motion';
import { TimelineUpdate } from '@/lib/types';
import { Calendar, Tag } from 'lucide-react';

interface TimelineProps {
  updates: TimelineUpdate[];
}

const Timeline = ({ updates }: TimelineProps) => {
  return (
    <div>
      {/* The h2 title is now managed by the parent page for better context */}
      <div className="relative border-l-2 border-gray-700 ml-4">
        {updates.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="mb-8 pl-8"
          >
            {/* Ring color updated for dark background */}
            <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 bg-red-600 rounded-full ring-8 ring-background">
              <Calendar className="w-3 h-3 text-white" />
            </span>
            {/* Component colors updated for dark background */}
            <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-soft">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 sm:mb-0">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  <Tag className="w-3 h-3 mr-1.5" />
                  {item.category}
                </span>
              </div>
              <p className="text-base font-normal text-gray-300">{item.update}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
