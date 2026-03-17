// [path]: app/(dashboard)/dashboard/projects/[projectId]/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getProjectById, updateProject, deleteProject, updateCategoryQaStatus, addInvoiceToProject, addPartToTask, addMediaToProject } from '@/lib/data-service';
import { mockTechnicians } from '@/lib/mock-data';
import { Project, TimelineUpdate, Technician, Message, SubTask, Invoice, Part, Media } from '@/lib/types';
import ProjectHeader from '@/components/ProjectHeader';
import InteractiveProgressCategory from '@/components/dashboard/InteractiveProgressCategory';
import AddTimelineForm from '@/components/dashboard/AddTimelineForm';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import EditProjectModal from '@/components/dashboard/EditProjectModal';
import Button from '@/components/ui/Button';
import ProjectStatusUpdater from '@/components/dashboard/ProjectStatusUpdater';
import Timeline from '@/components/Timeline';
import { calculateOverallProgress } from '@/lib/utils';
import MessagingCenter from '@/components/dashboard/MessagingCenter';
import FinancialsPanel from '@/components/dashboard/FinancialsPanel';
import { useAuth } from '@/app/AuthContext';
import AddInvoiceModal from '@/components/dashboard/AddInvoiceModal';
import AddPartFromInventoryModal from '@/components/dashboard/AddPartFromInventoryModal';
import AddMediaModal from '@/components/dashboard/AddMediaModal';
import VehicleChecklistSection from '@/components/dashboard/VehicleChecklistSection';
import { Camera } from 'lucide-react';

export default function WorkshopProjectPage({ params }: { params: { projectId: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isAddPartModalOpen, setIsAddPartModalOpen] = useState(false);
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false); // <-- NEW STATE
  const [taskForAddingPart, setTaskForAddingPart] = useState<{taskId: string, categoryId: string} | null>(null);
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  const fetchProject = useCallback(() => {
    const foundProject = getProjectById(params.projectId);
    setProject(foundProject || null);
  }, [params.projectId]);

  useEffect(() => {
    fetchProject();
    setTechnicians(mockTechnicians);
    setIsLoading(false);
  }, [params.projectId, fetchProject]);

  const saveProject = useCallback((updatedProject: Project) => {
    updateProject(updatedProject.id, updatedProject);
  }, []);

  const handleAddMedia = (mediaData: Omit<Media, 'id'>) => {
    if (!project) return;
    addMediaToProject(project.id, mediaData);
    fetchProject(); // Re-fetch data to show the new image
  };

  // ... (keep all other handler functions like handleQaStatusChange, handleInvoiceAdd, etc.)
  const handleQaStatusChange = useCallback((categoryId: string, qaPassed: boolean) => {
    if (!project) return;
    const updatedProject = updateCategoryQaStatus(project.id, categoryId, qaPassed);
    if (updatedProject) {
        setProject(updatedProject);
    }
  }, [project]);

  const handleInvoiceAdd = (invoiceData: Omit<Invoice, 'id' | 'status' | 'dueDate'>) => {
    if (!project) return;
    const updatedProject = addInvoiceToProject(project.id, invoiceData);
    if (updatedProject) {
        setProject(updatedProject);
    }
  };
  const handleAddPartClick = (taskId: string, categoryId: string) => {
    setTaskForAddingPart({ taskId, categoryId });
    setIsAddPartModalOpen(true);
  };

  const handleAddPartToTask = (partData: Omit<Part, 'id' | 'taskId' | 'status'>) => {
    if (!project || !taskForAddingPart) return;
    const { taskId, categoryId } = taskForAddingPart;
    const updatedProject = addPartToTask(project.id, categoryId, taskId, partData);
    if (updatedProject) {
        setProject(updatedProject);
    }
    setTaskForAddingPart(null);
  };

  const handleTaskStatusChange = (taskId: string, categoryId: string) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const newProject = {...currentProject, categories: currentProject.categories.map(cat => {
            if (cat.id === categoryId) {
                return {...cat, subTasks: cat.subTasks.map(task => {
                    if (task.id === taskId) {
                        const statusCycle: SubTask['status'][] = ['Pending', 'In Progress', 'Awaiting Approval', 'Completed'];
                        const currentIndex = statusCycle.indexOf(task.status);
                        const nextIndex = (currentIndex + 1) % statusCycle.length;
                        return { ...task, status: statusCycle[nextIndex] };
                    }
                    return task;
                })};
            }
            return cat;
        })};
        saveProject(newProject);
        return newProject;
    });
  };

  const handleToggleApproval = (taskId: string, categoryId: string) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const newProject = {...currentProject, categories: currentProject.categories.map(cat => (cat.id === categoryId ? {...cat, subTasks: cat.subTasks.map(task => (task.id === taskId ? { ...task, requiresClientApproval: !task.requiresClientApproval } : task))} : cat))};
        saveProject(newProject);
        return newProject;
    });
  };

  const handleTaskAssign = (taskId: string, categoryId: string, techId: string) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const newProject = {...currentProject, categories: currentProject.categories.map(cat => (cat.id === categoryId ? {...cat, subTasks: cat.subTasks.map(task => (task.id === taskId ? { ...task, assignedTo: techId || undefined } : task))} : cat))};
        saveProject(newProject);
        return newProject;
    });
  };

  const handleSendMessage = (message: Omit<Message, 'id' | 'createdAt' | 'authorRole'>) => {
    if (!user) return;
    setProject(currentProject => {
        if (!currentProject) return null;
        const newMessage: Message = { ...message, id: `msg-${Date.now()}`, createdAt: new Date().toISOString(), authorRole: user.role };
        const newProject = { ...currentProject, messages: [...currentProject.messages, newMessage] };
        saveProject(newProject);
        return newProject;
    });
  };

  const handleTimelineAdd = (newUpdate: Omit<TimelineUpdate, 'id' | 'date'>) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const newEntry: TimelineUpdate = { ...newUpdate, id: `t-${Date.now()}`, date: new Date().toISOString().split('T')[0] };
        const newProject = { ...currentProject, timeline: [newEntry, ...currentProject.timeline] };
        saveProject(newProject);
        return newProject;
    });
  };

  const handleStatusChange = (newStatus: Project['status'], holdReason: Project['holdReason']) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const reasonText = newStatus === 'On Hold' ? `Project on hold. Reason: ${holdReason}.` : `Project status changed to ${newStatus}.`;
        const newEntry: TimelineUpdate = { id: `t-status-${Date.now()}`, date: new Date().toISOString().split('T')[0], update: reasonText, category: 'Project Status' };
        const newProject = { ...currentProject, status: newStatus, holdReason: holdReason, timeline: [newEntry, ...currentProject.timeline] };
        saveProject(newProject);
        return newProject;
    });
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    setProject(currentProject => {
        if (!currentProject) return null;
        const invoiceToPay = currentProject.financials.invoices.find(inv => inv.id === invoiceId);
        if (!invoiceToPay || invoiceToPay.status === 'Paid') return currentProject;
        const newProject = {...currentProject, financials: {...currentProject.financials, totalPaid: currentProject.financials.totalPaid + invoiceToPay.amount, invoices: currentProject.financials.invoices.map(inv => inv.id === invoiceId ? { ...inv, status: 'Paid' as const } : inv),}, status: (currentProject.status === 'On Hold' && currentProject.holdReason === 'Awaiting Payment') ? 'Active' as const : currentProject.status, holdReason: (currentProject.status === 'On Hold' && currentProject.holdReason === 'Awaiting Payment') ? '' : currentProject.holdReason, timeline: (currentProject.status === 'On Hold' && currentProject.holdReason === 'Awaiting Payment') ? [{ id: `t-payment-${Date.now()}`, date: new Date().toISOString().split('T')[0], update: `Payment for '${invoiceToPay.description}' received. Work is resuming.`, category: 'Financial' }, ...currentProject.timeline] : currentProject.timeline };
        saveProject(newProject);
        return newProject;
    });
  };

  const handleSaveEdits = (updatedData: Partial<Project>) => {
    setProject(currentProject => {
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
  
  if (isLoading || !user) return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Loading Project...</p></div>;
  if (!project) return <div className="flex items-center justify-center h-full"><h1 className="text-2xl font-bold text-foreground">Project Not Found</h1></div>;

  const overallProgress = calculateOverallProgress(project);

  return (
    <>
      <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveEdits} project={project} />
      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title="Delete Project" message={`Are you sure you want to permanently delete the ${project.car.year} ${project.car.make} ${project.car.model} project? This action cannot be undone.`} />
      <AddInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} onSave={handleInvoiceAdd} />
      <AddPartFromInventoryModal isOpen={isAddPartModalOpen} onClose={() => setIsAddPartModalOpen(false)} onSave={handleAddPartToTask} />
      <AddMediaModal isOpen={isAddMediaModalOpen} onClose={() => setIsAddMediaModalOpen(false)} onSave={handleAddMedia} project={project} />

      <div>
        <ProjectHeader project={project} overallProgress={overallProgress} onEdit={() => setIsEditModalOpen(true)} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div id="financials" className="scroll-mt-24"><FinancialsPanel project={project} onMarkAsPaid={handleMarkAsPaid} onAddInvoiceClick={() => setIsInvoiceModalOpen(true)} /></div>
            <div id="messages" className="scroll-mt-24"><MessagingCenter project={project} currentUserRole={user.role} onSendMessage={handleSendMessage} /></div>
            <div id="progress" className="scroll-mt-24">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Manage Progress</h2>
                  <Button onClick={() => setIsAddMediaModalOpen(true)} variant="secondary" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Photo
                  </Button>
              </div>
              <div className="space-y-6">
                {project.categories.map(category => (
                  <InteractiveProgressCategory 
                    key={category.id} 
                    category={category}
                    technicians={technicians}
                    onTaskToggle={handleTaskStatusChange}
                    onTaskAssign={handleTaskAssign}
                    onToggleApproval={handleToggleApproval}
                    onQaStatusChange={handleQaStatusChange}
                    onAddPartClick={handleAddPartClick}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 space-y-8">
            <VehicleChecklistSection project={project} />
            <div className="bg-background border border-border p-6 rounded shadow-soft space-y-6 divide-y divide-border">
              <div><h3 className="text-xl font-bold mb-4 text-foreground">Workshop Tools</h3><AddTimelineForm project={project} onAddUpdate={handleTimelineAdd} /></div>
              <div className="pt-6"><h3 className="text-xl font-bold mb-4 text-foreground">Manage Status</h3><ProjectStatusUpdater currentStatus={project.status} onStatusChange={handleStatusChange} /></div>
              <div className="pt-6"><Button onClick={() => setIsDeleteModalOpen(true)} variant="outline" className="w-full">Delete Project</Button></div>
            </div>
            <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
               <h2 className="text-xl font-bold text-foreground mb-4">Project Timeline</h2>
               <Timeline updates={project.timeline} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}