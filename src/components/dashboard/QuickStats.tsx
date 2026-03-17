// [path]: components/dashboard/QuickStats.tsx

import { Car, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Project } from '@/lib/types';
import StatCard from './StatCard';
import { useMemo } from 'react';

interface QuickStatsProps {
  projects: Project[];
  // --- NEW: Prop to handle clicks ---
  onCardClick: (title: string, filteredProjects: Project[]) => void;
}

const QuickStats = ({ projects, onCardClick }: QuickStatsProps) => {

  // --- NEW: Memoized lists of projects for each stat ---
  const projectLists = useMemo(() => {
    const active = projects.filter(p => p.status === 'Active');
    const onHold = projects.filter(p => p.status === 'On Hold');
    
    // NOTE: These are simplified for the demo. A real app would have more robust date logic.
    const completedThisMonth = projects.filter(p => p.status === 'Completed');
    const upcomingDeliveries = projects.filter(p => p.promisedDate && new Date(p.promisedDate) > new Date() && p.status !== 'Completed');

    return { active, onHold, completedThisMonth, upcomingDeliveries };
  }, [projects]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        icon={Car} 
        title="Active Projects" 
        value={projectLists.active.length} 
        colorClass="bg-red-600"
        onClick={() => onCardClick('Active Projects', projectLists.active)}
      />
      <StatCard 
        icon={CheckCircle} 
        title="Completed This Month" 
        value={projectLists.completedThisMonth.length} 
        colorClass="bg-green-600" 
        onClick={() => onCardClick('Completed This Month', projectLists.completedThisMonth)}
      />
      <StatCard 
        icon={Clock} 
        title="Upcoming Deliveries" 
        value={projectLists.upcomingDeliveries.length} 
        colorClass="bg-blue-600" 
        onClick={() => onCardClick('Upcoming Deliveries', projectLists.upcomingDeliveries)}
      />
      <StatCard 
        icon={AlertTriangle} 
        title="Projects On Hold" 
        value={projectLists.onHold.length} 
        colorClass="bg-yellow-600"
        onClick={() => onCardClick('Projects On Hold', projectLists.onHold)}
      />
    </div>
  );
};

export default QuickStats;