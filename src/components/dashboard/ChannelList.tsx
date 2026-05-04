// [path]: components/dashboard/ChannelList.tsx

'use client';

import { Project } from '@/lib/types';
import { Car } from 'lucide-react';

interface ChannelListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onChannelSelect: (projectId: string) => void;
}

const ChannelList = ({ projects, selectedProjectId, onChannelSelect }: ChannelListProps) => {
  const activeProjects = projects.filter(p => p.status === 'Active' || p.status === 'On Hold');

  return (
    <div className="bg-gray-900/50 h-full rounded-lg border border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="font-bold text-white">Project Channels</h2>
      </div>
      <nav className="p-2">
        <ul>
          {activeProjects.map(project => (
            <li key={project.id}>
              <button
                onClick={() => onChannelSelect(project.id)}
                className={`w-full flex items-center text-left px-3 py-2 my-1 rounded-md transition-colors text-sm ${
                  selectedProjectId === project.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Car className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="font-medium">{`${project.car.year} ${project.car.make} ${project.car.model}`}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ChannelList;