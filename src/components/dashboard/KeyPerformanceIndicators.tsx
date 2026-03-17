// [path]: components/dashboard/KeyPerformanceIndicators.tsx

'use client';

import { useMemo } from 'react';
import { Project, Shift } from '@/lib/types';
import { calculateProjectProfitability } from '@/lib/utils';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import KpiDial from './KpiDial';
import { DollarSign, BarChart3, CheckCircle, Percent } from 'lucide-react';

interface KeyPerformanceIndicatorsProps {
  projects: Project[];
  shifts: Shift[];
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

const KeyPerformanceIndicators = ({ projects, shifts }: KeyPerformanceIndicatorsProps) => {
  const stats = useMemo(() => {
    // 1. Workshop Utilization
    const totalShiftHours = shifts.reduce((acc, shift) => acc + calculateShiftDuration(shift), 0);
    const totalTaskHours = projects.reduce((acc, p) => 
        acc + p.categories.reduce((catAcc, cat) => 
            catAcc + cat.subTasks.reduce((taskAcc, task) => taskAcc + (task.actualHours || 0), 0)
        , 0)
    , 0);
    const utilization = totalShiftHours > 0 ? (totalTaskHours / totalShiftHours) * 100 : 0;

    // 2. On-Time Delivery
    const completedProjects = projects.filter(p => p.status === 'Completed');
    const onTimeProjects = completedProjects.filter(p => 
        p.promisedDate && p.categories.every(c => c.subTasks.every(t => t.completedAt && new Date(t.completedAt) <= new Date(p.promisedDate!)))
    ).length;
    const onTimeDeliveryRate = completedProjects.length > 0 ? (onTimeProjects / completedProjects.length) * 100 : 100;

    // 3. Average Profit Margin
    const activeProjects = projects.filter(p => p.status === 'Active');
    const totalMargin = activeProjects.reduce((acc, p) => acc + calculateProjectProfitability(p).margin, 0);
    const averageMargin = activeProjects.length > 0 ? totalMargin / activeProjects.length : 0;

    return {
      revenueMTD: 'R115K', // Static for now
      utilization: `${Math.min(utilization, 100).toFixed(0)}%`,
      onTimeDelivery: `${onTimeDeliveryRate.toFixed(0)}%`,
      profitMargin: `${averageMargin.toFixed(1)}%`,
    };
  }, [projects, shifts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiDial title="Revenue (MTD)" value={stats.revenueMTD} Icon={DollarSign} colorClass="text-green-600" animationDelay={0.1} />
      <KpiDial title="Workshop Utilization" value={stats.utilization} Icon={BarChart3} colorClass="text-[var(--primary)]" animationDelay={0.2} />
      <KpiDial title="On-Time Delivery" value={stats.onTimeDelivery} Icon={CheckCircle} colorClass="text-amber-600" animationDelay={0.3} />
      <KpiDial title="Avg. Profit Margin" value={stats.profitMargin} Icon={Percent} colorClass="text-red-600" animationDelay={0.4} />
    </div>
  );
};

export default KeyPerformanceIndicators;