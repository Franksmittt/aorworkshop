// [path]: app/(dashboard)/dashboard/clients/page.tsx

import { mockProjects } from '@/lib/mock-data';
import { User, Car } from 'lucide-react';
import Link from 'next/link';

// Helper function to create a URL-friendly slug from a name
const createSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function ClientsPage() {
  const clients = mockProjects.reduce((acc, project) => {
    const clientName = project.customerName;
    if (!acc[clientName]) {
      acc[clientName] = {
        name: clientName,
        email: `contact+${clientName.split(' ').join('.').toLowerCase()}@example.com`,
        phone: '072 0426 477',
        projects: []
      };
    }
    acc[clientName].projects.push(project);
    return acc;
  }, {} as Record<string, { name: string; email: string; phone: string; projects: typeof mockProjects }>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Clients Control Room</h1>
        <p className="text-gray-400">The CRM and communication center for every customer relationship.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.values(clients).map(client => {
          const clientSlug = createSlug(client.name);
          return (
            <Link 
              href={`/dashboard/clients/${clientSlug}`} 
              key={client.name} 
              className="block bg-gray-800 border border-white/10 rounded-lg shadow-soft p-6 transition-all duration-300 hover:border-red-500/50 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{client.name}</h2>
                  <p className="text-sm text-gray-400">{client.email}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Projects ({client.projects.length})
                </h3>
                <ul className="space-y-1">
                  {client.projects.slice(0, 3).map(project => (
                    <li key={project.id} className="flex items-center text-sm text-gray-300">
                      <Car className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
                      <span>{`${project.car.year} ${project.car.make} ${project.car.model}`}</span>
                    </li>
                  ))}
                  {client.projects.length > 3 && <li className="text-xs text-gray-500 pl-6">...and more</li>}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}