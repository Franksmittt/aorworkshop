// [path]: app/(dashboard)/dashboard/projects/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/data-service';
import { Project } from '@/lib/types';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import ProjectsKanbanView from '@/components/dashboard/ProjectsKanbanView';
import ProjectsListView from '@/components/dashboard/ProjectsListView';
import ViewSwitcher from '@/components/ui/ViewSwitcher';

type View = 'kanban' | 'list';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<View>('kanban');

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <div>
            <h1 className="text-title text-[var(--shark)]">Jobs</h1>
            <p className="text-caption text-[var(--system-gray)] mt-1">Overview of all jobs.</p>
        </div>
        <div className="flex items-center space-x-4">
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            <Button href="/dashboard/projects/new" variant="primary">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Project
            </Button>
        </div>
      </div>

      <div className="flex-grow">
        {currentView === 'kanban' ? (
          <ProjectsKanbanView projects={projects} />
        ) : (
          <ProjectsListView projects={projects} />
        )}
      </div>
    </div>
  );
}