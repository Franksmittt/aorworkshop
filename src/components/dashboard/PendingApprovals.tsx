
// [path]: components/dashboard/PendingApprovals.tsx

'use client';

import { Project, SubTask } from '@/lib/types';
import { CheckSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface PendingApprovalsProps {
  projects: Project[];
}

interface ApprovalItem extends SubTask {
  projectId: string;
  projectName: string;
}

const PendingApprovals = ({ projects }: PendingApprovalsProps) => {
  const itemsNeedingApproval = useMemo(() => {
    const items: ApprovalItem[] = [];
    projects.forEach(project => {
      project.categories.forEach(category => {
        category.subTasks.forEach(task => {
          if (task.status === 'Awaiting Approval') {
            items.push({
              ...task,
              projectId: project.id,
              projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
            });
          }
        });
      });
    });
    return items;
  }, [projects]);

  const awaitingQcProjects = useMemo(() => projects.filter(p => p.status === 'Awaiting QC'), [projects]);

  return (
    <div className="card p-6 h-full">
      <h3 className="text-headline text-[var(--shark)] mb-4 flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-[var(--primary)]" />
        Pending approvals
      </h3>
      {awaitingQcProjects.length > 0 && (
        <div className="mb-4">
          <p className="text-subhead text-[var(--shark)] mb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
            Awaiting QC (your sign-off)
          </p>
          <ul className="space-y-2">
            {awaitingQcProjects.map(project => (
              <li key={project.id}>
                <Link href={`/dashboard/projects/${project.id}`} className="block p-3 rounded-[var(--radius-md)] hover:bg-[var(--athens-gray)] transition-colors border border-[var(--border-light)]">
                  <p className="font-semibold text-[var(--shark)]">{project.car.year} {project.car.make} {project.car.model}</p>
                  <p className="text-caption text-[var(--system-gray)]">Ready for approval</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {itemsNeedingApproval.length > 0 ? (
        <ul className="space-y-2">
          {itemsNeedingApproval.map(item => (
            <li key={item.id}>
              <Link href={`/dashboard/projects/${item.projectId}`} className="block p-3 rounded-[var(--radius-md)] hover:bg-[var(--athens-gray)] transition-colors">
                <p className="font-semibold text-[var(--shark)]">{item.name}</p>
                <p className="text-sm text-[var(--system-gray)]">{item.projectName}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : awaitingQcProjects.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-caption text-[var(--system-gray)]">No items awaiting approval.</p>
        </div>
      ) : null}
    </div>
  );
};

export default PendingApprovals;