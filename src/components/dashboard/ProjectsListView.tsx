// [path]: components/dashboard/ProjectsListView.tsx

'use client';

import { Project } from '@/lib/types';
import { calculateOverallProgress } from '@/lib/utils';
import Link from 'next/link';
import { AlertTriangle, Wrench } from 'lucide-react';

interface ProjectsListViewProps {
  projects: Project[];
}

const StatusDisplay = ({ status, holdReason }: { status: Project['status'], holdReason: Project['holdReason'] }) => {
  const statusClasses: Record<Project['status'], string> = {
    Active: 'bg-[var(--success)]/10 text-green-700 border border-green-300',
    'On Hold': 'bg-amber-100 text-amber-800 border border-amber-300',
    'Awaiting QC': 'bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/30',
    Completed: 'bg-[var(--system-gray)]/10 text-[var(--shark)] border border-[var(--border)]',
  };

  const holdReasonIcons: { [key: string]: React.ReactElement } = {
    'Awaiting Parts': <Wrench className="h-3 w-3 mr-1.5" />,
    'Awaiting Payment': <span className="mr-1.5 font-bold text-lg leading-none">$</span>,
    'Awaiting Client Decision': <AlertTriangle className="h-3 w-3 mr-1.5" />,
  };

  const displayText = status === 'On Hold' && holdReason ? holdReason : status;
  return (
    <div className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {status === 'On Hold' && holdReason && holdReasonIcons[holdReason]}
      {displayText}
    </div>
  );
};

const ProjectsListView = ({ projects }: ProjectsListViewProps) => {
  return (
    <div className="card rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--border-light)]">
          <thead className="bg-[var(--athens-gray)]">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--system-gray)] uppercase tracking-wider">Vehicle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--system-gray)] uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--system-gray)] uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--system-gray)] uppercase tracking-wider">Progress</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-light)]">
            {projects.map(project => {
              const progress = calculateOverallProgress(project);
              return (
                <tr key={project.id} className="hover:bg-[var(--athens-gray)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[var(--shark)]">{project.car.year} {project.car.make} {project.car.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[var(--system-gray)]">{project.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusDisplay status={project.status} holdReason={project.holdReason} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[var(--fill)] rounded-full h-1.5">
                        <div className="bg-[var(--primary)] h-1.5 rounded-full transition-samsung" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-sm text-[var(--system-gray)]">{Math.round(progress)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/dashboard/projects/${project.id}`} className="text-[var(--primary)] hover:underline">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsListView;