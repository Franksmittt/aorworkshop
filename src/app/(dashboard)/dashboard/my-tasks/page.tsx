// [path]: app/(dashboard)/dashboard/my-tasks/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getProjects, logTaskTime, updateTaskStatus, addNoteToTask, getShifts } from '@/lib/data-service';
import { mockTechnicians } from '@/lib/mock-data';
import { AssignedTask, SubTask, Project, Shift } from '@/lib/types';
import { CheckCircle2, Circle, Clock, AlertOctagon, Flame, CheckSquare, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '@/app/AuthContext';
import JobCardModal from '@/components/dashboard/JobCardModal';
import { startOfWeek, parseISO, differenceInMilliseconds } from 'date-fns';
import ProgressBar from '@/components/ui/ProgressBar'; // <-- NEW IMPORT
import { calculateOverallProgress } from '@/lib/utils'; // <-- NEW IMPORT

const calculateShiftDuration = (shift: Shift): number => {
    if (!shift.clockOutTime) return 0;
    const duration = differenceInMilliseconds(parseISO(shift.clockOutTime), parseISO(shift.clockInTime));
    const breakDuration = shift.breaks.reduce((acc, br) => {
        if (br.endTime) {
            return acc + differenceInMilliseconds(parseISO(br.endTime), parseISO(br.startTime));
        }
        return acc;
    }, 0);
    return (duration - breakDuration) / (1000 * 60 * 60); // convert to hours
};

export default function TechnicianTasksPage() {
  const { user, isLoading } = useAuth();
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);
  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
        setAllProjects(getProjects());
        setAllShifts(getShifts());
    }
  }, [user, isLoading]);

  const myTasks = useMemo(() => {
    if (!user || user.role !== 'Staff') return [];
    
    const currentTechnician = mockTechnicians.find(tech => tech.userId === user.id);
    if (!currentTechnician) return [];

    const assignedTasks: AssignedTask[] = [];
    allProjects.forEach(project => {
        if (project.status === 'Active' || project.status === 'On Hold') {
            project.categories.forEach(category => {
                category.subTasks.forEach(task => {
                    if (task.assignedTo === currentTechnician.id) {
                        assignedTasks.push({ ...task, projectId: project.id, projectName: `${project.car.year} ${project.car.make} ${project.car.model}`, categoryName: category.name });
                    }
                });
            });
        }
    });

    const priorityOrder: Record<SubTask['priority'], number> = { 'Urgent': 1, 'High': 2, 'Normal': 3, 'Low': 4 };
    const statusOrder = { 'In Progress': 1, 'Pending': 2, 'Awaiting Approval': 3, 'Completed': 4 };
    
    assignedTasks.sort((a, b) => {
        if (statusOrder[a.status] !== statusOrder[b.status]) { return statusOrder[a.status] - statusOrder[b.status]; }
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    return assignedTasks;
  }, [allProjects, user]);

  const performanceStats = useMemo(() => {
    if(!user) return { tasksCompletedThisWeek: 0, taskHoursThisWeek: 0, shiftHoursThisWeek: 0, utilization: 0, efficiency: 0 };

    const weeklyStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    let tasksCompletedThisWeek = 0;
    let taskHoursThisWeek = 0;
    let shiftHoursThisWeek = 0;
    let estimatedHoursForCompletedTasks = 0;

    const currentTechnician = mockTechnicians.find(tech => tech.userId === user.id);

    allProjects.forEach(project => {
        project.categories.forEach(category => {
            category.subTasks.forEach(task => {
                if(task.assignedTo === currentTechnician?.id && task.status === 'Completed' && task.completedAt && parseISO(task.completedAt) >= weeklyStartDate) {
                    tasksCompletedThisWeek++;
                    const actualHours = task.actualHours || 0;
                    taskHoursThisWeek += actualHours;
                    estimatedHoursForCompletedTasks += task.estimateHours || actualHours; // Fallback to actual if no estimate
                }
            });
        });
    });

    allShifts.forEach(shift => {
        if(shift.userId === user.id && parseISO(shift.clockInTime) >= weeklyStartDate){
            shiftHoursThisWeek += calculateShiftDuration(shift);
        }
    });
    
    const utilization = shiftHoursThisWeek > 0 ? (taskHoursThisWeek / shiftHoursThisWeek) * 100 : 0;
    const efficiency = taskHoursThisWeek > 0 ? (estimatedHoursForCompletedTasks / taskHoursThisWeek) * 100 : 0;

    return { tasksCompletedThisWeek, taskHoursThisWeek, shiftHoursThisWeek, utilization: Math.min(utilization, 100), efficiency: Math.min(efficiency, 200) }; // Cap efficiency at 200%
  }, [user, allProjects, allShifts]);

  const updateProjectInState = (updatedProject: Project) => {
      setAllProjects(currentProjects => 
          currentProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
      );
  };

  const handleStatusChange = (taskId: string, categoryId: string, newStatus: AssignedTask['status']) => {
    const taskToUpdate = myTasks.find(t => t.id === taskId);
    if (taskToUpdate) {
        const updatedProject = updateTaskStatus(taskToUpdate.projectId, categoryId, taskId, newStatus);
        if (updatedProject) {
            updateProjectInState(updatedProject);
            setSelectedTask(current => current && current.id === taskId ? { ...current, status: newStatus } : current);
        }
    }
  };

  const handleAddNote = (taskId: string, categoryId: string, noteText: string) => {
    if (!user) return;
    const taskToUpdate = myTasks.find(t => t.id === taskId);
    if (taskToUpdate) {
      const newNoteData = { authorId: user.id, authorName: user.name, note: noteText, createdAt: new Date().toISOString(), type: 'Log' as const };
      const updatedProject = addNoteToTask(taskToUpdate.projectId, categoryId, taskId, newNoteData);
      if(updatedProject){
          updateProjectInState(updatedProject);
          const updatedTaskNotes = updatedProject.categories.flatMap(c => c.subTasks).find(t => t.id === taskId)?.internalNotes;
          setSelectedTask(current => current && current.id === taskId ? { ...current, internalNotes: updatedTaskNotes } : current);
      }
    }
  };

  const handleStartTimer = (task: AssignedTask) => {
    if (activeTimerTaskId) {
        alert("Another timer is already running. Please stop it before starting a new one.");
        return;
    }
    setActiveTimerTaskId(task.id);
    setTimerStartTime(Date.now());
  };

  const handleStopTimer = () => {
    if (!activeTimerTaskId || !timerStartTime) return;
    const elapsedHours = (Date.now() - timerStartTime) / (1000 * 60 * 60);
    const taskToUpdate = myTasks.find(t => t.id === activeTimerTaskId);
    if (taskToUpdate) {
        const updatedProject = logTaskTime(taskToUpdate.projectId, taskToUpdate.categoryName, taskToUpdate.id, elapsedHours);
        if(updatedProject) {
            updateProjectInState(updatedProject);
            const updatedHours = (taskToUpdate.actualHours || 0) + elapsedHours;
            setSelectedTask(current => current && current.id === activeTimerTaskId ? { ...current, actualHours: updatedHours } : current);
        }
    }
    setActiveTimerTaskId(null);
    setTimerStartTime(null);
  };

  const handleTaskClick = (task: AssignedTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const getStatusIndicator = (status: SubTask['status']) => {
    switch(status) {
        case 'Completed': return <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />;
        case 'Awaiting Approval': return <Clock className="h-5 w-5 text-[var(--warning)]" />;
        default: return <Circle className="h-5 w-5 text-[var(--system-gray-2)]" />;
    }
  };

  const getPriorityStyles = (priority: SubTask['priority']): { indicator: string; tag: string; icon: React.ReactNode } => {
    switch(priority) {
        case 'Urgent': return { indicator: 'border-l-4 border-[var(--error)]', tag: 'bg-red-100 text-red-800', icon: <Flame className="h-3 w-3 mr-1.5" /> };
        case 'High': return { indicator: 'border-l-4 border-[var(--warning)]', tag: 'bg-amber-100 text-amber-800', icon: <AlertOctagon className="h-3 w-3 mr-1.5" /> };
        default: return { indicator: 'border-l-4 border-transparent', tag: '', icon: null };
    }
  };

  if (isLoading) return <p className="text-[var(--system-gray)]">Loading your workshop…</p>;
  if (!user) return <p className="text-[var(--error)]">Error: Not logged in.</p>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `Good morning, ${user.name.split(' ')[0]}`;
    if (hour < 18) return `Good afternoon, ${user.name.split(' ')[0]}`;
    return `Good evening, ${user.name.split(' ')[0]}`;
  };

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-hero text-[var(--shark)]">{getGreeting()}</h1>
          <p className="text-caption text-[var(--system-gray)] mt-1.5">Your tasks, with the highest priority at the top.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-4 rounded-[var(--radius-lg)] flex items-center gap-4">
            <CheckSquare className="h-8 w-8 text-[var(--success)] shrink-0" />
            <div>
              <p className="text-2xl font-bold text-[var(--shark)]">{performanceStats.tasksCompletedThisWeek}</p>
              <p className="text-caption text-[var(--system-gray)]">Tasks completed (week)</p>
            </div>
          </div>
          <div className="card p-4 rounded-[var(--radius-lg)] flex items-center gap-4">
            <Zap className="h-8 w-8 text-[var(--warning)] shrink-0" />
            <div>
              <p className="text-2xl font-bold text-[var(--shark)]">{performanceStats.efficiency.toFixed(0)}%</p>
              <p className="text-caption text-[var(--system-gray)]">Efficiency vs estimates</p>
            </div>
          </div>
          <div className="card p-4 rounded-[var(--radius-lg)] flex items-center gap-4">
            <Briefcase className="h-8 w-8 text-[var(--primary)] shrink-0" />
            <div>
              <p className="text-2xl font-bold text-[var(--shark)]">{performanceStats.utilization.toFixed(0)}%</p>
              <p className="text-caption text-[var(--system-gray)]">Workshop utilization</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {myTasks.filter(t => t.status !== 'Completed').length > 0 ? (
            myTasks.filter(t => t.status !== 'Completed').map(task => {
              const priorityStyles = getPriorityStyles(task.priority);
              const parentProject = allProjects.find(p => p.id === task.projectId);
              const projectProgress = parentProject ? calculateOverallProgress(parentProject) : 0;
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`card rounded-[var(--radius-lg)] overflow-hidden transition-samsung hover:border-[var(--primary)]/50 cursor-pointer ${priorityStyles.indicator}`}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>{getStatusIndicator(task.status)}</div>
                      <div>
                        <p className="font-semibold text-[var(--shark)]">{task.name}</p>
                        <span className="text-caption text-[var(--system-gray)]">{task.projectName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {task.priority !== 'Normal' && task.priority !== 'Low' && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center ${priorityStyles.tag}`}>
                          {priorityStyles.icon} {task.priority}
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${task.status === 'Awaiting Approval' ? 'bg-amber-100 text-amber-800' : 'bg-[var(--primary)]/10 text-[var(--primary)]'}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <ProgressBar progress={projectProgress} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card rounded-[var(--radius-lg)] text-center py-16">
              <p className="text-[var(--system-gray)]">You have no active tasks assigned.</p>
            </div>
          )}
        </div>
      </div>
      <JobCardModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask}
        activeTimerTaskId={activeTimerTaskId}
        timerStartTime={timerStartTime}
        onStartTimer={handleStartTimer}
        onStopTimer={handleStopTimer}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
      />
    </>
  );
}