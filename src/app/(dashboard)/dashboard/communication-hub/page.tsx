// [path]: app/(dashboard)/dashboard/communication-hub/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getProjects, updateProject } from '@/lib/data-service';
import { Project, Message } from '@/lib/types';
import ChannelList from '@/components/dashboard/ChannelList';
import MessageView from '@/components/dashboard/MessageView';
import { useAuth } from '@/app/AuthContext';

export default function CommunicationHubPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const handleSendMessage = (projectId: string, message: Omit<Message, 'id' | 'createdAt' | 'authorRole'>) => {
    if (!user) return;

    const projectToUpdate = projects.find(p => p.id === projectId);
    if (!projectToUpdate) return;
    
    const newMessage: Message = { 
        ...message, 
        id: `msg-${Date.now()}`, 
        createdAt: new Date().toISOString(),
        authorRole: user.role
    };
    
    const updatedProject = { 
        ...projectToUpdate, 
        messages: [...projectToUpdate.messages, newMessage] 
    };

    updateProject(projectId, { messages: updatedProject.messages });
    
    setProjects(currentProjects => 
        currentProjects.map(p => p.id === projectId ? updatedProject : p)
    );
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return (
    <div className="h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Communication Hub</h1>
        <p className="text-gray-400">A unified center for all project messaging.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-4.5rem)]">
        <div className="lg:col-span-1 h-full">
          <ChannelList 
            projects={projects} 
            selectedProjectId={selectedProjectId}
            onChannelSelect={setSelectedProjectId}
          />
        </div>
        <div className="lg:col-span-3 h-full">
            <MessageView 
                project={selectedProject}
                currentUserRole={user?.role || 'Staff'}
                onSendMessage={handleSendMessage}
            />
        </div>
      </div>
    </div>
  );
}