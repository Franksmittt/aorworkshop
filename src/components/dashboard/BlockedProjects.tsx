// [path]: components/dashboard/BlockedProjects.tsx

'use client';

import { Project } from '@/lib/types';
import { AlertTriangle, Wrench, DollarSign, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface BlockedProjectsProps {
  projects: Project[];
}

const holdReasonIcons: { [key: string]: React.ElementType } = {
    'Awaiting Parts': Wrench,
    'Awaiting Payment': DollarSign,
    'Awaiting Client Decision': HelpCircle,
};

const BlockedProjects = ({ projects }: BlockedProjectsProps) => {
  const blockedProjects = projects.filter(p => p.status === 'On Hold');

  return (
    <div className="card p-6 h-full">
      <h3 className="text-headline text-[var(--shark)] mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
        Blocked
      </h3>
      {blockedProjects.length > 0 ? (
        <ul className="space-y-2">
          {blockedProjects.map(project => {
            const Icon = project.holdReason ? holdReasonIcons[project.holdReason] || AlertTriangle : AlertTriangle;
            return (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`} className="block p-3 rounded-[var(--radius-md)] hover:bg-[var(--athens-gray)] transition-colors">
                  <p className="font-semibold text-[var(--shark)]">{project.car.year} {project.car.make} {project.car.model}</p>
                  <div className="flex items-center gap-2 text-sm text-[var(--system-gray)] mt-1">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{project.holdReason}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex items-center justify-center h-48">
          <p className="text-caption text-[var(--system-gray)]">No jobs blocked.</p>
        </div>
      )}
    </div>
  );
};

export default BlockedProjects;