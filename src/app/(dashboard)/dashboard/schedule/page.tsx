// [path]: app/(dashboard)/dashboard/schedule/page.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { getProjects, scheduleTask } from '@/lib/data-service';
import { Project, SubTask, UnscheduledTask, Technician } from '@/lib/types';
import ScheduleView from '@/components/dashboard/ScheduleView';
import UnscheduledTasksPanel from '@/components/dashboard/UnscheduledTasksPanel';
import ScheduleTaskModal from '@/components/dashboard/ScheduleTaskModal';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format } from 'date-fns';

export default function SchedulePage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToSchedule, setTaskToSchedule] = useState<UnscheduledTask | null>(null);
    
    // NEW: State to hold pre-filled data from a drop event
    const [scheduleDefaults, setScheduleDefaults] = useState<{ startDate: string; assignedTo: string } | null>(null);

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const unscheduledTasks = useMemo(() => {
        const tasks: UnscheduledTask[] = [];
        projects.forEach(project => {
            if (project.status === 'Active' || project.status === 'On Hold') {
                project.categories.forEach(category => {
                    category.subTasks.forEach(task => {
                        if (task.status === 'Pending' && !task.startDate) {
                            tasks.push({ 
                                ...task, 
                                projectId: project.id,
                                projectName: `${project.car.year} ${project.car.make} ${project.car.model}`,
                                categoryId: category.id
                            });
                        }
                    });
                });
            }
        });
        const priorityOrder: Record<SubTask['priority'], number> = { 'Urgent': 1, 'High': 2, 'Normal': 3, 'Low': 4 };
        return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }, [projects]);
    
    // MODIFIED: This now just opens the modal. The drop handler also does this.
    const handleTaskSelect = (task: UnscheduledTask) => {
        setTaskToSchedule(task);
        setScheduleDefaults(null); // Clear defaults if manually selected
        setIsModalOpen(true);
    };

    // NEW: Handles the drop event from the ScheduleView
    const handleTaskDrop = (task: UnscheduledTask, technician: Technician, date: Date) => {
        setTaskToSchedule(task);
        setScheduleDefaults({
            startDate: format(date, 'yyyy-MM-dd'),
            assignedTo: technician.id,
        });
        setIsModalOpen(true);
    };

    const handleSaveSchedule = (taskId: string, details: { startDate: string; dueDate: string; assignedTo: string }) => {
        if (!taskToSchedule) return;

        const updatedProject = scheduleTask(taskToSchedule.projectId, taskToSchedule.categoryId, taskId, details);
        
        if (updatedProject) {
            setProjects(currentProjects => currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p));
        }
        
        // Reset state
        setIsModalOpen(false);
        setTaskToSchedule(null);
        setScheduleDefaults(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToSchedule(null);
        setScheduleDefaults(null);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Workshop Command Center</h1>
                    <p className="text-gray-400">Drag tasks from the backlog to the schedule. Days are colored by technician workload.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-12rem)]">
                    <div className="lg:col-span-3 h-full">
                        <ScheduleView allProjects={projects} onTaskDrop={handleTaskDrop} />
                    </div>
                    <div className="lg:col-span-1 h-full">
                        <UnscheduledTasksPanel tasks={unscheduledTasks} onTaskSelect={handleTaskSelect} />
                    </div>
                </div>
            </div>

            <ScheduleTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                task={taskToSchedule}
                onSave={handleSaveSchedule}
                defaults={scheduleDefaults}
            />
        </DndProvider>
    );
}