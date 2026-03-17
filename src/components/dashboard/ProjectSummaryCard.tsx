import { Project } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import ProgressBar from '../ui/ProgressBar';

interface ProjectSummaryCardProps {
  project: Project;
  progress: number;
}

const ProjectSummaryCard = ({ project, progress }: ProjectSummaryCardProps) => {
  const statusClasses: Record<Project['status'], string> = {
    Active: 'bg-[var(--success)]/10 text-green-700 border border-green-300',
    'On Hold': 'bg-amber-100 text-amber-800 border border-amber-300',
    'Awaiting QC': 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30',
    Completed: 'bg-[var(--system-gray)]/10 text-[var(--shark)] border border-[var(--border)]',
  };
  const photoUrl = project.media.length > 0 ? project.media[0].url : 'https://images.unsplash.com/photo-1588258933833-28b2b5161d87?q=80&w=870&auto=format&fit=crop';

  return (
    <div className="card rounded-[var(--radius-lg)] overflow-hidden transition-samsung hover:shadow-soft">
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
            <p className="font-bold text-lg text-[var(--shark)]">{project.car.year} {project.car.make} {project.car.model}</p>
            <p className="text-caption text-[var(--system-gray)]">{project.customerName}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusClasses[project.status]}`}>
            {project.status}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-[var(--system-gray)]">Progress</span>
            <span className="text-xs font-bold text-[var(--primary)]">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
        <Link href={`/dashboard/projects/${project.id}`} className="block w-full text-center mt-6 bg-[var(--primary)] text-white px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors">
          View details
        </Link>
      </div>
    </div>
  );
};

export default ProjectSummaryCard;