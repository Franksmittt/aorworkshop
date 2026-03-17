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
  activeTask: { name: string; projectName: string } | undefined;
}

const TechnicianLiveFeed = ({ projects }: TechnicianLiveFeedProps) => {
  const feedItems = useMemo(() => {
    const activeProjects = projects.filter(p => p.status === 'Active');
    return mockTechnicians.map(tech => {
      const user = mockUsers.find(u => u.id === tech.userId);
      if (!user) return null;
      const { status, breakType } = dataService.getUserTimeTrackingStatus(user.id);
      let activeTask: { name: string; projectName: string } | undefined;
      if (status === 'ClockedIn') {
        for (const project of activeProjects) {
          for (const category of project.categories) {
            const task = category.subTasks.find(t => t.assignedTo === tech.id && t.status === 'In Progress');
            if (task) {
              activeTask = { name: task.name, projectName: `${project.car.year} ${project.car.make} ${project.car.model}` };
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
        return <div className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse" title="Clocked In" />;
      case 'OnBreak':
        return <div className="w-3 h-3 rounded-full bg-[var(--warning)]" title="On Break" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-[var(--system-gray-2)]" title="Clocked Out" />;
    }
  };

  return (
    <div className="card p-6 rounded-[var(--radius-lg)] h-full">
      <h3 className="text-headline text-[var(--shark)] mb-4">Technician Live Feed</h3>
      <ul className="space-y-4">
        {feedItems.map(item => (
          <li key={item.technician.id} className="flex items-center gap-3">
            <div className="flex-shrink-0">{getStatusIndicator(item.status)}</div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[var(--shark)]">{item.technician.name}</p>
              {item.status === 'ClockedIn' && item.activeTask && (
                <p className="text-caption text-[var(--system-gray)]">
                  <span className="text-[var(--primary)]">{item.activeTask.name}</span> on {item.activeTask.projectName}
                </p>
              )}
              {item.status === 'OnBreak' && (
                <p className="text-caption text-[var(--warning)] italic">On {item.breakType} Break</p>
              )}
              {item.status === 'ClockedOut' && (
                <p className="text-caption text-[var(--system-gray)] italic">Clocked Out</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechnicianLiveFeed;
