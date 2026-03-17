import { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import ProgressBar from '../ui/ProgressBar';

interface ProjectSummaryCardProps {
  project: Project;
  progress: number;
}

const ProjectSummaryCard = ({ project, progress }: ProjectSummaryCardProps) => {
  const statusClasses = {
    Active: 'bg-green-900/50 text-green-300 border border-green-500/30',
    'On Hold': 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30',
    Completed: 'bg-red-900/50 text-red-300 border border-red-500/30',
  };
  const photoUrl = project.media.length > 0 ? project.media[0].url : 'https://images.unsplash.com/photo-1588258933833-28b2b5161d87?q=80&w=870&auto=format&fit=crop';

  return (
    <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft overflow-hidden transition-transform hover:-translate-y-1">
      <div className="relative h-40">
        <Image 
          src={photoUrl} 
          alt={`${project.car.make} ${project.car.model}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="font-bold text-lg text-white">{project.car.year} {project.car.make} {project.car.model}</p>
            <p className="text-sm text-gray-400">{project.customerName}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusClasses[project.status]}`}>
            {project.status}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <span className="text-xs font-bold text-red-500">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
        <Link href={`/dashboard/projects/${project.id}`} className="block w-full text-center mt-6 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;