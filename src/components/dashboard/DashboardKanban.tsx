// [path]: components/dashboard/DashboardKanban.tsx

'use client';

import { useMemo } from 'react';
import { Project, SubTask } from '@/lib/types';
import Link from 'next/link';
import { mockTechnicians } from '@/lib/mock-data';
import { FITMENT_CATEGORIES } from '@/lib/fitment-categories';

interface KanbanTask extends SubTask {
  projectName: string;
  projectId: string;
  categoryName: string;
}

interface DashboardKanbanProps {
  projects: Project[];
}

const DashboardKanban = ({ projects }: DashboardKanbanProps) => {
  const columns = useMemo(() => {
    // Define the primary stages of work for the dashboard
    const stages = FITMENT_CATEGORIES.map(f => f.name);
    
    // Find all tasks that are currently 'In Progress' from active projects
    const inProgressTasks: KanbanTask[] = projects
      .filter(p => p.status === 'Active')
      .flatMap(project =>
        project.categories.flatMap(category =>
          category.subTasks
            .filter(task => task.status === 'In Progress')
            .map(task => ({
              ...task,
              projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
              projectId: project.id,
              categoryName: category.name,
            }))
        )
      );

    // Group the tasks by their category name (stage)
    const tasksByStage = inProgressTasks.reduce((acc, task) => {
      const stage = task.categoryName;
      if (!acc[stage]) {
        acc[stage] = [];
      }
      acc[stage].push(task);
      return acc;
    }, {} as Record<string, KanbanTask[]>);

    return stages.map(stage => ({
      title: stage,
      tasks: tasksByStage[stage] || []
    }));

  }, [projects]);
  
  const getTechnicianName = (techId: string | undefined) => {
    if (!techId) return 'Unassigned';
    return mockTechnicians.find(t => t.id === techId)?.name || 'Unknown';
  };

  return (
    <div className="card p-6">
      <h3 className="text-headline text-[var(--shark)] mb-4">In progress</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map(column => (
          <div key={column.title} className="w-72 flex-shrink-0 bg-[var(--athens-gray)] rounded-[var(--radius-md)] border border-[var(--border-light)]">
            <div className="p-3 border-b border-[var(--border-light)]">
              <h4 className="font-semibold text-[var(--shark)] text-sm">{column.title} <span className="text-xs font-normal text-[var(--system-gray)]">{column.tasks.length}</span></h4>
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              {column.tasks.length > 0 ? column.tasks.map(task => (
                <div key={task.id} className="bg-white p-3 rounded-[var(--radius-sm)] border border-[var(--border-light)] shadow-[var(--shadow-sm)]">
                  <p className="text-sm font-medium text-[var(--shark)] mb-1">{task.name}</p>
                  <Link href={`/dashboard/projects/${task.projectId}`} className="text-xs text-[var(--primary)] hover:underline">
                    {task.projectName}
                  </Link>
                  <p className="text-xs text-[var(--system-gray)] mt-2 pt-2 border-t border-[var(--border-light)]">
                    Assigned to: <span className="font-semibold text-[var(--shark)]">{getTechnicianName(task.assignedTo)}</span>
                  </p>
                </div>
              )) : (
                 <div className="flex items-center justify-center h-full p-4">
                    <p className="text-xs text-[var(--system-gray)]">No tasks.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardKanban;