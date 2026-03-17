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

  const statusClasses: Record<Project['status'], string> = {
    Active: 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/30',
    'On Hold': 'bg-amber-100 text-amber-800 border border-amber-300',
    'Awaiting QC': 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30',
    Completed: 'bg-[var(--system-gray)]/10 text-[var(--shark)] border border-[var(--border)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card rounded-[var(--radius-lg)] p-6 md:p-8 mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-hero text-[var(--shark)]">
            {car.year} {car.make} {car.model}
            {car.numberPlate && <span className="text-title text-[var(--system-gray)] font-normal ml-2">— {car.numberPlate}</span>}
          </h1>
          <p className="text-body text-[var(--system-gray)] mt-1">
            Customer: <span className="font-semibold text-[var(--shark)]">{customerName}</span>
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-right">
            <div className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${statusClasses[status]}`}>
              {status}
            </div>
            {status === 'On Hold' && holdReason && (
              <p className="text-xs text-amber-700 mt-1">{holdReason}</p>
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
          <span className="text-sm font-medium text-[var(--system-gray)]">Overall progress</span>
          <span className="text-lg font-bold text-[var(--primary)]">{Math.round(overallProgress)}%</span>
        </div>
        <ProgressBar progress={overallProgress} />
      </div>
    </motion.div>
  );
};

export default ProjectHeader;