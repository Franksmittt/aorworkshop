// [path]: components/dashboard/PartsBoard.tsx

'use client';

import { Project, Part } from '@/lib/types';
import { useMemo } from 'react';
import Link from 'next/link';

interface PartWithContext extends Part {
  projectName: string;
  projectId: string;
  taskName: string;
}

interface PartsBoardProps {
  allProjects: Project[];
}

const PartsBoard = ({ allProjects }: PartsBoardProps) => {
  const allParts = useMemo(() => {
    const partsList: PartWithContext[] = [];
    const activeProjects = allProjects.filter(p => p.status === 'Active' || p.status === 'On Hold');

    activeProjects.forEach(project => {
      project.categories.forEach(category => {
        category.subTasks.forEach(task => {
          if (task.parts && task.parts.length > 0) {
            task.parts.forEach(part => {
              partsList.push({
                ...part,
                projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
                projectId: project.id,
                taskName: task.name,
              });
            });
          }
        });
      });
    });
    return partsList;
  }, [allProjects]);

  const getStatusClasses = (status: Part['status']) => {
    switch (status) {
      case 'Received':
        return 'bg-green-900/50 text-green-300 border border-green-500/30';
      case 'Ordered':
        return 'bg-blue-900/50 text-blue-300 border border-blue-500/30';
      case 'Cancelled':
        return 'bg-red-900/50 text-red-300 border border-red-500/30';
      default: // Needed
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30';
    }
  };

  // In a real app, this would trigger a backend update.
  const handleStatusChange = (partId: string, currentStatus: Part['status']) => {
    const statusCycle: Part['status'][] = ['Needed', 'Ordered', 'Received', 'Cancelled'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusCycle.length;
    const newStatus = statusCycle[nextIndex];
    alert(`Changing status for part ${partId} from ${currentStatus} to ${newStatus}.\n(This would be a database update).`);
  };

  return (
    <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Part Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Project</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {allParts.map(part => (
              <tr key={part.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{part.name}</div>
                  <div className="text-xs text-gray-500">{part.partNumber || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/dashboard/projects/${part.projectId}`} className="text-sm text-red-500 hover:underline">
                    {part.projectName}
                  </Link>
                  <div className="text-xs text-gray-500">Task: {part.taskName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{part.qty}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleStatusChange(part.id, part.status)}
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${getStatusClasses(part.status)}`}
                  >
                    {part.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {allParts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No parts currently required for active projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartsBoard;