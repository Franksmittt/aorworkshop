// [path]: components/dashboard/WorkshopKanban.tsx

'use client';

import { useMemo } from 'react';
import { Project, SubTask } from '@/lib/types';
import { mockTechnicians } from '@/lib/mock-data';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock, Construction } from 'lucide-react';

interface KanbanTask extends SubTask {
  projectName: string;
  projectId: string;
  categoryName: string;
}

interface WorkshopKanbanProps {
  allProjects: Project[];
}

const WorkshopKanban = ({ allProjects }: WorkshopKanbanProps) => {

  const columns = useMemo(() => {
    const activeProjects = allProjects.filter(p => p.status === 'Active');
    
    const allTasks: KanbanTask[] = activeProjects.flatMap(project =>
      project.categories.flatMap(category =>
        category.subTasks.map(task => ({
          ...task,
          projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
          projectId: project.id,
          categoryName: category.name,
        }))
      )
    );

    const tasksByTechnician = allTasks.reduce((acc, task) => {
      const techId = task.assignedTo || 'unassigned';
      if (!acc[techId]) {
        acc[techId] = [];
      }
      acc[techId].push(task);
      return acc;
    }, {} as Record<string, KanbanTask[]>);

    const techColumns = mockTechnicians.map(tech => ({
      id: tech.id,
      title: tech.name,
      tasks: tasksByTechnician[tech.id] || []
    }));
    
    return [
        { id: 'unassigned', title: 'Unassigned', tasks: tasksByTechnician['unassigned'] || [] },
        ...techColumns
    ];

  }, [allProjects]);

  // CORRECTED: This function now returns the correct icon based on the task's 'status'.
  const getStatusIndicator = (status: SubTask['status']) => {
    switch(status) {
        case 'Completed': return { 
            Icon: CheckCircle2, 
            text: 'Completed', 
            color: 'text-green-500' 
        };
        case 'Awaiting Approval': return { 
            Icon: Clock, 
            text: 'Awaiting Approval', 
            color: 'text-yellow-500' 
        };
        case 'In Progress': return { 
            Icon: Construction, 
            text: 'In Progress', 
            color: 'text-blue-500' 
        };
        default: return { 
            Icon: Circle, 
            text: 'Pending', 
            color: 'text-gray-600' 
        };
    }
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {columns.map(column => (
        <div key={column.id} className="w-80 flex-shrink-0 bg-gray-900/50 rounded-lg">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold text-white">{column.title} <span className="text-sm font-normal text-gray-500">{column.tasks.length}</span></h3>
          </div>
          <div className="p-2 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
            {column.tasks.length > 0 ? column.tasks.map(task => {
              const { Icon, text, color } = getStatusIndicator(task.status);
              return (
                <div key={task.id} className="bg-gray-800 p-3 rounded-md border border-gray-700 shadow-soft">
                  <p className="text-sm font-medium text-gray-200 mb-2">{task.name}</p>
                  <div className="text-xs text-gray-400">
                    <p>{task.categoryName}</p>
                    <Link href={`/dashboard/projects/${task.projectId}`} className="text-red-500 hover:underline">
                      {task.projectName}
                    </Link>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-700 flex items-center">
                    <Icon className={`h-4 w-4 mr-2 ${color}`} />
                    <span className={`text-xs font-semibold ${color}`}>
                      {text}
                    </span>
                  </div>
                </div>
              );
            }) : (
                <div className="flex items-center justify-center h-full p-4">
                    <p className="text-sm text-gray-600">No tasks assigned.</p>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkshopKanban;