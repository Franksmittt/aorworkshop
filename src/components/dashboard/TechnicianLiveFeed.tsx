// [path]: components/dashboard/TechnicianLiveFeed.tsx

'use client';

import { useMemo } from 'react';
import { Project, Technician, BreakType } from '@/lib/types';
import { mockTechnicians, mockUsers } from '@/lib/mock-data';
import * as dataService from '@/lib/data-service';

interface TechnicianLiveFeedProps {
  projects: Project[];
}

type Status = 'ClockedIn' | 'ClockedOut' | 'OnBreak';

interface FeedItem {
  technician: Technician;
  status: Status;
  breakType: BreakType | null;
  // This is the corrected line:
  activeTask: {
    name: string;
    projectName: string;
  } | undefined;
}

const TechnicianLiveFeed = ({ projects }: TechnicianLiveFeedProps) => {
  const feedItems = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'Active');

    return mockTechnicians.map(tech => {
      const user = mockUsers.find(u => u.id === tech.userId);
      if (!user) return null;

      const { status, breakType } = dataService.getUserTimeTrackingStatus(user.id);
      
      let activeTask: { name: string; projectName: string; } | undefined;
      if (status === 'ClockedIn') {
        for (const project of activeProjects) {
          for (const category of project.categories) {
            const foundTask = category.subTasks.find(
              task => task.assignedTo === tech.id && task.status === 'In Progress'
            );
            if (foundTask) {
              activeTask = {
                name: foundTask.name,
                projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
              };
              break;
            }
          }
          if (activeTask) break;
        }
      }

      return { technician: tech, status, breakType, activeTask };
    }).filter((item): item is FeedItem => item !== null);
  }, [projects]);

  const getStatusIndicator = (status: Status) => {
    switch (status) {
      case 'ClockedIn':
        return <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" title="Clocked In"></div>;
      case 'OnBreak':
        return <div className="w-3 h-3 rounded-full bg-yellow-500" title="On Break"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-600" title="Clocked Out"></div>;
    }
  };

  return (
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4">Technician Live Feed</h3>
      <ul className="space-y-4">
        {feedItems.map(item => (
          <li key={item.technician.id} className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {getStatusIndicator(item.status)}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-white">{item.technician.name}</p>
              {item.status === 'ClockedIn' && item.activeTask && (
                <p className="text-sm text-gray-400">
                  <span className="text-blue-400">{item.activeTask.name}</span> on {item.activeTask.projectName}
                </p>
              )}
              {item.status === 'OnBreak' && (
                <p className="text-sm text-yellow-400 italic">On {item.breakType} Break</p>
              )}
               {item.status === 'ClockedOut' && (
                <p className="text-sm text-gray-500 italic">Clocked Out</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechnicianLiveFeed;