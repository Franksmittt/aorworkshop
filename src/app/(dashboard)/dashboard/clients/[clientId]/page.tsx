// [path]: app/(dashboard)/dashboard/clients/[clientId]/page.tsx

'use client';

import { getProjects } from '@/lib/data-service';
import { User } from 'lucide-react';
import { useMemo } from 'react';
import ProjectSummaryCard from '@/components/dashboard/ProjectSummaryCard';
import { calculateOverallProgress } from '@/lib/utils';
import { notFound } from 'next/navigation';
import ClientPendingActions from '@/components/dashboard/ClientPendingActions'; // <-- NEW IMPORT

export default function ClientDetailPage({ params }: { params: { clientId: string } }) {
  const { client, clientProjects } = useMemo(() => {
    const clientName = params.clientId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const allProjects = getProjects();
    const clientProjects = allProjects.filter(p => p.customerName === clientName);

    if (clientProjects.length === 0) {
      return { client: null, clientProjects: [] };
    }

    const clientData = {
      name: clientName,
      email: `contact+${clientName.split(' ').join('.').toLowerCase()}@example.com`,
      phone: '072 0426 477',
    };

    return { client: clientData, clientProjects };
  }, [params.clientId]);

  if (!client) {
    return notFound();
  }

  return (
    <div>
      <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft p-6 mb-8">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mr-6">
            <User className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{client.name}</h1>
            <div className="flex space-x-6 text-sm text-gray-400 mt-1">
              <a href={`mailto:${client.email}`} className="hover:text-red-500">{client.email}</a>
              <span>{client.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW: Pending Actions Component --- */}
      <ClientPendingActions projects={clientProjects} />

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Digital Garage</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientProjects.map(project => {
            const progress = calculateOverallProgress(project);
            return <ProjectSummaryCard key={project.id} project={project} progress={progress} />;
          })}
        </div>
      </div>
    </div>
  );
}