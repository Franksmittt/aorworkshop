// [path]: components/dashboard/ClientPendingActions.tsx

'use client';

import { useMemo } from 'react';
import { Project } from '@/lib/types';
import { HelpCircle, ThumbsUp } from 'lucide-react';
import Link from 'next/link';

interface ClientPendingActionsProps {
  projects: Project[];
}

const ClientPendingActions = ({ projects }: ClientPendingActionsProps) => {
  const actions = useMemo(() => {
    return projects.flatMap(project =>
      project.categories.flatMap(category =>
        category.subTasks
          .filter(task => task.requiresClientApproval && task.status === 'Awaiting Approval')
          .map(task => ({
            ...task,
            projectId: project.id,
            projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
          }))
      )
    );
  }, [projects]);

  if (actions.length === 0) {
    return (
      <div className="bg-green-900/50 border border-green-500/30 p-4 rounded-lg flex items-center mb-8">
        <ThumbsUp className="h-5 w-5 text-green-300 mr-3" />
        <p className="text-sm font-medium text-green-200">No actions are currently pending from this client.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-900/50 border-2 border-blue-500/50 p-6 rounded-lg shadow-large mb-8">
      <div className="flex items-center mb-4">
        <HelpCircle className="h-6 w-6 text-blue-300 mr-4" />
        <div>
          <h2 className="text-xl font-bold text-white">Pending Client Actions</h2>
          <p className="text-blue-200 text-sm">The following items require this client&apos;s input.</p>
        </div>
      </div>
      <div className="space-y-3">
        {actions.map(task => (
          <Link
            key={task.id}
            href={`/dashboard/projects/${task.projectId}#progress`}
            className="block bg-gray-800/50 p-3 rounded-md border border-gray-700 hover:bg-gray-700/50 transition-colors"
          >
            <p className="font-semibold text-white">{task.name}</p>
            <p className="text-xs text-gray-400">{task.projectName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClientPendingActions;