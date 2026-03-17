// [path]: src/app/(dashboard)/dashboard/reports/page.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { getProjects, getShifts, getTechnicians } from '@/lib/data-service';
import { Project, Shift, Technician } from '@/lib/types';
import { startOfWeek, startOfMonth, parseISO, differenceInMilliseconds } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

type TimeRange = 'This Week' | 'This Month' | 'All Time';

interface PerformanceStats {
  technicianId: string;
  name: string;
  tasksCompleted: number;
  taskHours: number;
  shiftHours: number;
  utilization: number;
  rate: number; // <-- ADDED
}

type SortKey = keyof PerformanceStats;

const calculateShiftDuration = (shift: Shift): number => {
    if (!shift.clockOutTime) return 0;
    const duration = differenceInMilliseconds(parseISO(shift.clockOutTime), parseISO(shift.clockInTime));
    const breakDuration = shift.breaks.reduce((acc, br) => {
        if (br.endTime) {
            return acc + differenceInMilliseconds(parseISO(br.endTime), parseISO(br.startTime));
        }
        return acc;
    }, 0);
    return (duration - breakDuration) / (1000 * 60 * 60);
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('This Week');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'utilization', direction: 'descending' });
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [allTechnicians, setAllTechnicians] = useState<Technician[]>([]);
  
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

    const techDataMap: Record<string, { tasksCompleted: number; taskHours: number; shiftHours: number; }> = {};
    allTechnicians.forEach(tech => {
        techDataMap[tech.userId] = { tasksCompleted: 0, taskHours: 0, shiftHours: 0 };
    });

    allProjects.forEach(p => p.categories.forEach(c => c.subTasks.forEach(task => {
        const tech = allTechnicians.find(t => t.id === task.assignedTo);
        if (task.status === 'Completed' && task.completedAt && tech && techDataMap[tech.userId] && parseISO(task.completedAt) >= startDate) {
            techDataMap[tech.userId].tasksCompleted++;
            techDataMap[tech.userId].taskHours += task.actualHours || 0;
        }
    })));

    allShifts.forEach(shift => {
        if (techDataMap[shift.userId] && parseISO(shift.clockInTime) >= startDate) {
            techDataMap[shift.userId].shiftHours += calculateShiftDuration(shift);
        }
    });

    return allTechnicians.map(tech => {
        const data = techDataMap[tech.userId];
        const utilization = data.shiftHours > 0 ? (data.taskHours / data.shiftHours) * 100 : 0;
        return {
            technicianId: tech.userId,
            name: tech.name,
            tasksCompleted: data.tasksCompleted,
            taskHours: data.taskHours,
            shiftHours: data.shiftHours,
            utilization: Math.min(utilization, 100),
            // --- FIX: Changed tech.rate to tech.hourlyRate ---
            rate: tech.hourlyRate || 0,
        };
    });
  }, [allProjects, allShifts, allTechnicians, timeRange]);
  
  const sortedData = useMemo(() => {
    const sortableData = [...performanceData];
    sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });
    return sortableData;
  }, [performanceData, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
        direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const timeRangeFilters: TimeRange[] = ['This Week', 'This Month', 'All Time'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Reports Control Room</h1>
        <p className="text-gray-400">Deep-dive performance analysis and business intelligence.</p>
      </div>

      <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Technician Leaderboard</h2>
            <div className="flex items-center space-x-2 bg-gray-900/50 border border-white/10 rounded-lg p-1 mt-4 sm:mt-0">
                {timeRangeFilters.map(filter => (
                <button key={filter} onClick={() => setTimeRange(filter)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${timeRange === filter ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}>
                    {filter}
                </button>
                ))}
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900/50">
             <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                {[
                    { key: 'tasksCompleted', label: 'Tasks Completed' },
                    { key: 'taskHours', label: 'Task Hours' },
                    { key: 'shiftHours', label: 'Shift Hours' },
                    { key: 'rate', label: 'Rate P/H' }, // <-- ADDED
                    { key: 'utilization', label: 'Utilization' }
                ].map(({ key, label }) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer hover:text-white" onClick={() => requestSort(key as SortKey)}>
                        <span className="flex items-center">{label} <ArrowUpDown className="h-3 w-3 ml-2" /></span>
                    </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {sortedData.map((tech) => (
                <tr key={tech.technicianId} className="hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{tech.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tech.tasksCompleted}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tech.taskHours.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tech.shiftHours.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-300">{formatCurrency(tech.rate)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${tech.utilization > 75 ? 'text-green-400' : tech.utilization > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {tech.utilization.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}