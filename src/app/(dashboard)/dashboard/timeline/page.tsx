import { mockProjects } from '@/lib/mock-data';
import { Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function TimelinePage() {
  const allUpdates = mockProjects
    .flatMap(project => 
      project.timeline.map(update => ({
        ...update,
        project,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Global Timeline</h1>
        <p className="text-gray-400">A chronological feed of all updates across all projects.</p>
      </div>

      <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
        <div className="relative border-l-2 border-gray-700 ml-4">
          {allUpdates.map((item) => (
            <div key={item.id} className="mb-8 pl-8">
              <span className="absolute -left-[11px] flex items-center justify-center w-6 h-6 bg-red-600 rounded-full ring-8 ring-background">
                <Calendar className="w-3 h-3 text-white" />
              </span>
              <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <Link href={`/dashboard/projects/${item.project.id}`} className="font-semibold text-white hover:text-red-500 transition-colors">
                    {item.project.car.year} {item.project.car.make} {item.project.car.model}
                  </Link>
                  <time className="mt-1 sm:mt-0 text-sm font-normal text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <p className="text-base font-normal text-gray-300 mb-2">{item.update}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                  <Tag className="w-3 h-3 mr-1.5" />
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}