import { Project } from '@/lib/types';
import { Clock } from 'lucide-react';
import Link from 'next/link';

interface ActivityFeedProps {
  projects: Project[];
}

const ActivityFeed = ({ projects }: ActivityFeedProps) => {
  const allUpdates = projects
    .flatMap(p => 
      p.timeline.map(t => ({ ...t, project: p }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    // Updated component to a dark theme
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <ul className="space-y-4">
        {allUpdates.map(item => (
          <li key={item.id} className="flex items-start">
            <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center mr-4">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                <Link href={`/dashboard/projects/${item.project.id}`} className="font-semibold text-red-500 hover:underline">
                  {item.project.car.year} {item.project.car.model}:
                </Link>
                {' '}{item.update}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </li>
         ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;