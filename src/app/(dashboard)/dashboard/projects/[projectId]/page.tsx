// [path]: app/(dashboard)/dashboard/projects/[projectId]/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectById, updateProject, deleteProject, addMediaToProject } from '@/lib/data-service';
import { Project, TimelineUpdate, SubTask, Media } from '@/lib/types';
import ProjectHeader from '@/components/ProjectHeader';
import InteractiveProgressCategory from '@/components/dashboard/InteractiveProgressCategory';
import AddTimelineForm from '@/components/dashboard/AddTimelineForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EditProjectModal from '@/components/dashboard/EditProjectModal';
import Button from '@/components/ui/Button';
import ProjectStatusUpdater from '@/components/dashboard/ProjectStatusUpdater';
import Timeline from '@/components/Timeline';
import { calculateOverallProgress } from '@/lib/utils';
import { useAuth } from '@/app/AuthContext';
import AddMediaModal from '@/components/dashboard/AddMediaModal';
import VehicleChecklistSection from '@/components/dashboard/VehicleChecklistSection';
import { Camera } from 'lucide-react';

/** Simple progress cycle for this test build (no client-approval step). */
const STATUS_CYCLE: SubTask['status'][] = ['Pending', 'In Progress', 'Completed'];

function nextTaskStatus(current: SubTask['status']): SubTask['status'] {
  let i = STATUS_CYCLE.indexOf(current);
  if (i === -1) {
    i = current === 'Awaiting Approval' ? 1 : 0;
  }
  return STATUS_CYCLE[(i + 1) % STATUS_CYCLE.length];
}

export default function WorkshopProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);

  const fetchProject = useCallback(() => {
    const foundProject = getProjectById(params.projectId);
    setProject(foundProject || null);
  }, [params.projectId]);

  useEffect(() => {
    fetchProject();
    setIsLoading(false);
  }, [params.projectId, fetchProject]);

  const saveProject = useCallback((updatedProject: Project) => {
    updateProject(updatedProject.id, updatedProject);
  }, []);

  const handleAddMedia = (mediaData: Omit<Media, 'id'>) => {
    if (!project) return;
    addMediaToProject(project.id, mediaData);
    fetchProject();
  };

  const handleTaskStatusChange = (taskId: string, categoryId: string) => {
    setProject((currentProject) => {
      if (!currentProject) return null;
      const newProject = {
        ...currentProject,
        categories: currentProject.categories.map((cat) => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            subTasks: cat.subTasks.map((task) => {
              if (task.id !== taskId) return task;
              const nextStatus = nextTaskStatus(task.status);
              const nextTask: SubTask = { ...task, status: nextStatus };
              if (nextStatus === 'Completed') {
                nextTask.completedAt = new Date().toISOString();
              } else {
                delete nextTask.completedAt;
              }
              return nextTask;
            }),
          };
        }),
      };
      saveProject(newProject);
      return newProject;
    });
  };

  const handleTimelineAdd = (newUpdate: Omit<TimelineUpdate, 'id' | 'date'>) => {
    setProject((currentProject) => {
      if (!currentProject) return null;
      const newEntry: TimelineUpdate = {
        ...newUpdate,
        id: `t-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
      };
      const newProject = { ...currentProject, timeline: [newEntry, ...currentProject.timeline] };
      saveProject(newProject);
      return newProject;
    });
  };

  const handleStatusChange = (newStatus: Project['status'], holdReason: Project['holdReason']) => {
    setProject((currentProject) => {
      if (!currentProject) return null;
      const reasonText =
        newStatus === 'On Hold' ? `Project on hold. Reason: ${holdReason}.` : `Project status changed to ${newStatus}.`;
      const newEntry: TimelineUpdate = {
        id: `t-status-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        update: reasonText,
        category: 'Project Status',
      };
      const newProject = {
        ...currentProject,
        status: newStatus,
        holdReason,
        timeline: [newEntry, ...currentProject.timeline],
      };
      saveProject(newProject);
      return newProject;
    });
  };

  const handleSaveEdits = (updatedData: Partial<Project>) => {
    setProject((currentProject) => {
      if (!currentProject) return null;
      const newProject = { ...currentProject, ...updatedData };
      saveProject(newProject);
      return newProject;
    });
  };

  const handleDelete = () => {
    if (project) {
      deleteProject(project.id);
      router.push('/dashboard/projects');
    }
  };

  if (isLoading || !user)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[var(--system-gray)]">Loading project…</p>
      </div>
    );
  if (!project)
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-[var(--shark)]">Project not found</h1>
      </div>
    );

  const overallProgress = calculateOverallProgress(project);
  const isBoss = user.role === 'Boss';

  return (
    <>
      {isBoss && (
        <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdits} project={project} />
      )}
      {isBoss && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Delete Project"
          message={`Are you sure you want to permanently delete the ${project.car.year} ${project.car.make} ${project.car.model} project? This action cannot be undone.`}
        />
      )}
      <AddMediaModal isOpen={isAddMediaModalOpen} onClose={() => setIsAddMediaModalOpen(false)} onSave={handleAddMedia} project={project} />

      <div>
        <ProjectHeader project={project} overallProgress={overallProgress} onEdit={isBoss ? () => setIsEditModalOpen(true) : undefined} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div id="progress" className="scroll-mt-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-title text-[var(--shark)]">Build progress</h2>
                <Button onClick={() => setIsAddMediaModalOpen(true)} variant="secondary" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
              <p className="text-caption text-[var(--system-gray)] mb-4">
                Tap a step to move it: <strong>Pending</strong> → <strong>In progress</strong> → <strong>Done</strong>. Each step adds its
                share to the bar (total 100%). Use photos and the timeline to log time and proof — no task assignment or money in this test
                run.
              </p>
              <div className="space-y-6">
                {project.categories.map((category) => (
                  <InteractiveProgressCategory
                    key={category.id}
                    category={category}
                    onTaskToggle={handleTaskStatusChange}
                    showAddPart={false}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <VehicleChecklistSection project={project} />
            <div className="card border border-[var(--border-light)] p-6 rounded-[var(--radius-lg)] space-y-6 divide-y divide-[var(--border-light)]">
              <div>
                <h3 className="text-headline text-[var(--shark)] mb-4">Timeline notes</h3>
                <AddTimelineForm project={project} onAddUpdate={handleTimelineAdd} />
              </div>
              <div className="pt-6">
                <h3 className="text-headline text-[var(--shark)] mb-4">Job status</h3>
                <ProjectStatusUpdater currentStatus={project.status} onStatusChange={handleStatusChange} />
              </div>
              {isBoss && (
                <div className="pt-6">
                  <Button onClick={() => setIsDeleteModalOpen(true)} variant="destructive" className="w-full">
                    Delete project
                  </Button>
                </div>
              )}
            </div>
            <div className="card p-6 rounded-[var(--radius-lg)]">
              <h2 className="text-headline text-[var(--shark)] mb-4">Project timeline</h2>
              <Timeline updates={project.timeline} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
