// [path]: components/dashboard/ProjectsKanbanView.tsx

'use client';

import { useMemo } from 'react';
import { Project } from '@/lib/types';
import { calculateOverallProgress } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import ProgressBar from '../ui/ProgressBar';

interface ProjectsKanbanViewProps {
  projects: Project[];
}

const STAGES = ['Intake', 'Body & Paint', 'Engine & Drivetrain', 'Chassis & Suspension', 'Interior & Electrical', 'Final Assembly', 'Completed'];

const getProjectStage = (project: Project): string => {
    if (project.status === 'Completed') {
        return 'Completed';
    }

    const inProgressTask = project.categories.flatMap(c => c.subTasks.map(t => ({...t, categoryName: c.name}))).find(t => t.status === 'In Progress');
    if (inProgressTask) {
        // A simple mapping for demonstration. This could be more complex.
        if (inProgressTask.categoryName.includes('Interior') || inProgressTask.categoryName.includes('Electrical')) return 'Interior & Electrical';
        if (STAGES.includes(inProgressTask.categoryName)) return inProgressTask.categoryName;
    }

    const pendingTask = project.categories.flatMap(c => c.subTasks.map(t => ({...t, categoryName: c.name}))).find(t => t.status === 'Pending');
    if (pendingTask) {
        if (pendingTask.categoryName.includes('Interior') || pendingTask.categoryName.includes('Electrical')) return 'Interior & Electrical';
        if (STAGES.includes(pendingTask.categoryName)) return pendingTask.categoryName;
    }
    
    // Default to Intake if no tasks have been started
    const allPending = project.categories.every(c => c.subTasks.every(t => t.status === 'Pending'));
    if(allPending) return 'Intake';

    // Fallback if logic doesn't catch a case
    return 'Final Assembly';
};

const ProjectsKanbanView = ({ projects }: ProjectsKanbanViewProps) => {

  const projectsByStage = useMemo(() => {
    const grouped = STAGES.reduce((acc, stage) => {
        acc[stage] = [];
        return acc;
    }, {} as Record<string, Project[]>);

    projects.forEach(project => {
        const stage = getProjectStage(project);
        if (grouped[stage]) {
            grouped[stage].push(project);
        }
    });

    return grouped;
  }, [projects]);

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {STAGES.map(stage => (
        <div key={stage} className="w-80 flex-shrink-0 bg-gray-900/50 rounded-lg">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white">{stage} <span className="text-sm font-normal text-gray-500">{projectsByStage[stage].length}</span></h3>
          </div>
          <div className="p-2 space-y-3 h-[calc(100vh-270px)] overflow-y-auto">
            {projectsByStage[stage].map(project => {
                const progress = calculateOverallProgress(project);
                const photoUrl = project.media.length > 0 ? project.media[0].url : 'https://images.unsplash.com/photo-1588258933833-28b2b5161d87?q=80&w=870&auto=format&fit=crop';
                return (
                    <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block bg-gray-800 p-3 rounded-md border border-gray-700 shadow-soft hover:border-red-500/50 transition-colors">
                        <div className="relative h-24 rounded-md overflow-hidden mb-3">
                           <Image 
                                src={photoUrl} 
                                alt={`${project.car.make} ${project.car.model}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="text-sm font-bold text-gray-200">{`${project.car.year} ${project.car.make} ${project.car.model}`}</p>
                        <p className="text-xs text-gray-400 mb-2">{project.customerName}</p>
                        <ProgressBar progress={progress} />
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">{project.status}</span>
                            <span className="text-xs font-bold text-red-500">{Math.round(progress)}%</span>
                        </div>
                    </Link>
                );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsKanbanView;