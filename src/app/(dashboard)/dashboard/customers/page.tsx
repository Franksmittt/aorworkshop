import { mockProjects } from '@/lib/mock-data';
import { User, Car } from 'lucide-react';
import Link from 'next/link';

export default function CustomersPage() {
  // Group projects by customer name to create a unique customer list
  const customers = mockProjects.reduce((acc, project) => {
    const customerName = project.customerName;
    if (!acc[customerName]) {
      acc[customerName] = {
        name: customerName,
        email: `contact+${customerName.split(' ').join('.').toLowerCase()}@example.com`,
        phone: '072 0426 477',
        projects: []
      };
    }
    acc[customerName].projects.push(project);
    return acc;
  }, {} as Record<string, { name: string; email: string; phone: string; projects: typeof mockProjects }>);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Customers</h1>
        <p className="text-gray-400">A list of all clients and their projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.values(customers).map(customer => (
          <div key={customer.name} className="bg-gray-800 border border-white/10 rounded-lg shadow-soft p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{customer.name}</h2>
                <p className="text-sm text-gray-400">{customer.email}</p>
                <p className="text-sm text-gray-400">{customer.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Projects</h3>
               <ul className="space-y-2">
                {customer.projects.map(project => (
                  <li key={project.id}>
                    <Link href={`/dashboard/projects/${project.id}`} className="flex items-center p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                      <Car className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-300">{`${project.car.year} ${project.car.make} ${project.car.model}`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}