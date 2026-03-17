// [path]: src/app/(dashboard)/dashboard/performance/page.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { getProjects, getShifts, getTechnicians, getUserTimeTrackingStatus } from '@/lib/data-service';
import { Project, Shift, Technician } from '@/lib/types';
import { startOfWeek, startOfMonth, parseISO, differenceInMilliseconds } from 'date-fns';
import PerformanceBarChart from '@/components/dashboard/PerformanceBarChart';
import TechnicianPerformanceCard from '@/components/dashboard/TechnicianPerformanceCard';
import TechnicianDetailModal from '@/components/dashboard/TechnicianDetailModal';
import { LucideIcon, Wrench, Coffee, LogOut } from 'lucide-react';

type TimeRange = 'This Week' | 'This Month' | 'All Time';

interface PerformanceStats {
  technicianId: string;
  name: string;
  tasksCompleted: number;
  taskHours: number;
  shiftHours: number;
  utilization: number;
  currentStatus: {
    Icon: LucideIcon;
    text: string;
    color: string;
    subtext?: string;
  };
}

const calculateShiftDuration = (shift: Shift): number => {
    if (!shift.clockOutTime) return 0;
    const duration = differenceInMilliseconds(parseISO(shift.clockOutTime), parseISO(shift.clockInTime));
    const breakDuration = shift.breaks.reduce((acc, br) => {
        if (br.endTime) {
            return acc + differenceInMilliseconds(parseISO(br.endTime), parseISO(br.startTime));
        }
        return acc;
    }, 0);
    return (duration - breakDuration) / (1000 * 60 * 60); // convert to hours
};

export default function PerformancePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('This Week');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<Technician[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<PerformanceStats | null>(null);

  useEffect(() => {
    setAllProjects(getProjects());
    setAllShifts(getShifts());
    setAllTechnicians(getTechnicians());
  }, []);

  const performanceData: PerformanceStats[] = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (timeRange === 'This Week') startDate = startOfWeek(now, { weekStartsOn: 1 });
    else if (timeRange === 'This Month') startDate = startOfMonth(now);
    else startDate = new Date(0);

    const technicianData: Record<string, { tasksCompleted: number; taskHours: number; shiftHours: number; }> = {};
    
    allTechnicians.forEach(tech => {
        technicianData[tech.userId] = { tasksCompleted: 0, taskHours: 0, shiftHours: 0 };
    });

    allProjects.forEach(project => {
      project.categories.forEach(category => {
        category.subTasks.forEach(task => {
          const tech = allTechnicians.find(t => t.id === task.assignedTo);
          if (task.status === 'Completed' && task.completedAt && tech && technicianData[tech.userId] && parseISO(task.completedAt) >= startDate) {
            technicianData[tech.userId].tasksCompleted += 1;
            technicianData[tech.userId].taskHours += task.actualHours || 0;
          }
        });
      });
    });

    allShifts.forEach(shift => {
        if(technicianData[shift.userId] && parseISO(shift.clockInTime) >= startDate){
            technicianData[shift.userId].shiftHours += calculateShiftDuration(shift);
        }
    });

    return allTechnicians.map(tech => {
        const data = technicianData[tech.userId];
        const utilization = data.shiftHours > 0 ? (data.taskHours / data.shiftHours) * 100 : 0;
        
        const timeStatus = getUserTimeTrackingStatus(tech.userId);
        let currentStatus: PerformanceStats['currentStatus'];

        switch (timeStatus.status) {
          case 'OnBreak':
            currentStatus = { Icon: Coffee, text: `On ${timeStatus.breakType} Break`, color: 'text-yellow-400' };
            break;
          case 'ClockedOut':
            currentStatus = { Icon: LogOut, text: 'Clocked Out', color: 'text-gray-500' };
            break;
          case 'ClockedIn':
            const activeTask = allProjects
              .flatMap(p => p.categories.flatMap(c => c.subTasks.map(t => ({...t, projectName: `${p.car.year} ${p.car.make} ${p.car.model}` }))))
              .find(t => t.assignedTo === tech.id && t.status === 'In Progress');
            
            if (activeTask) {
              currentStatus = { Icon: Wrench, text: activeTask.name, subtext: activeTask.projectName, color: 'text-green-400 animate-pulse' };
            } else {
              currentStatus = { Icon: Wrench, text: 'Available', color: 'text-blue-400' };
            }
            break;
        }

        return {
            technicianId: tech.id,
            name: tech.name,
            tasksCompleted: data.tasksCompleted,
            taskHours: data.taskHours,
            shiftHours: data.shiftHours,
            utilization: Math.min(utilization, 100),
            currentStatus,
        };
    });
  }, [allProjects, allShifts, allTechnicians, timeRange]);

  const chartData = performanceData.map(tech => ({
      name: tech.name,
      taskHours: parseFloat(tech.taskHours.toFixed(2)),
      shiftHours: parseFloat(tech.shiftHours.toFixed(2)),
  }));

  const timeRangeFilters: TimeRange[] = ['This Week', 'This Month', 'All Time'];

  const handleCardClick = (technician: PerformanceStats) => {
    setSelectedTechnician(technician);
    setIsModalOpen(true);
  };

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Technician Performance</h1>
            <p className="text-gray-400">Productivity overview for the workshop team. Click a card for details.</p>
          </div>
          <div className="flex items-center space-x-2 bg-gray-800 border border-white/10 rounded-lg p-1 mt-4 sm:mt-0">
            {timeRangeFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setTimeRange(filter)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeRange === filter ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {performanceData.map(techStats => (
            <TechnicianPerformanceCard 
              key={techStats.technicianId}
              technicianStats={techStats}
              onClick={() => handleCardClick(techStats)}
            />
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Shift Hours vs. Task Hours ({timeRange})</h2>
          <PerformanceBarChart data={chartData} />
        </div>
      </div>

      <TechnicianDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        technician={selectedTechnician}
        projects={allProjects}
        timeRange={timeRange}
      />
    </>
  );
}