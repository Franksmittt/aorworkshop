// [path]: components/ProjectHeader.tsx

'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import ProgressBar from './ui/ProgressBar';
import Button from './ui/Button';
import { Edit, BookOpen } from 'lucide-react';
// Removed unused 'Link' import

interface ProjectHeaderProps {
  project: Project;
  overallProgress: number;
  onEdit?: () => void;
}

const ProjectHeader = ({ project, overallProgress, onEdit }: ProjectHeaderProps) => {
  const { car, customerName, status, holdReason } = project;

  const statusClasses = {
    Active: 'bg-green-900/50 text-green-300 border border-green-500/30',
    'On Hold': 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30',
    Completed: 'bg-red-900/50 text-red-300 border border-red-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/50 backdrop-blur-sm border border-white/10 shadow-large rounded-lg p-6 md:p-8 mb-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {car.year} {car.make} {car.model}
          </h1>
          <p className="text-lg text-gray-400">
            Project for: <span className="font-semibold text-gray-200">{customerName}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${statusClasses[status]}`}>
              {status}
            </div>
            {status === 'On Hold' && holdReason && (
              <p className="text-xs text-yellow-300 mt-1">{holdReason}</p>
            )}
          </div>
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          {/* --- NEW: Conditionally render the Build Book button --- */}
          {status === 'Completed' && (
            <Button href={`/projects/${project.id}/build-book`} variant="primary" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              View Build Book
            </Button>
          )}
        </div>
      </div>
 
       <div>
         <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">Overall Progress</span>
          <span className="text-lg font-bold text-red-500">{Math.round(overallProgress)}%</span>
        </div>
        <ProgressBar progress={overallProgress} />
      </div>
    </motion.div>
  );
};

export default ProjectHeader;