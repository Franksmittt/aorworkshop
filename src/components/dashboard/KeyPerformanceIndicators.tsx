// [path]: components/dashboard/KeyPerformanceIndicators.tsx

'use client';

import { useMemo } from 'react';
import { Project, Shift } from '@/lib/types';
import { calculateOverallProgress } from '@/lib/utils';
import { differenceInMilliseconds, parseISO } from 'date-fns';
import KpiDial from './KpiDial';
import { BarChart3, CheckCircle, Gauge, ListChecks } from 'lucide-react';

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
  return (duration - breakDuration) / (1000 * 60 * 60);
};

const KeyPerformanceIndicators = ({ projects, shifts }: KeyPerformanceIndicatorsProps) => {
  const stats = useMemo(() => {
    const totalShiftHours = shifts.reduce((acc, shift) => acc + calculateShiftDuration(shift), 0);
    const totalTaskHours = projects.reduce(
      (acc, p) =>
        acc +
        p.categories.reduce(
          (catAcc, cat) => catAcc + cat.subTasks.reduce((taskAcc, task) => taskAcc + (task.actualHours || 0), 0),
          0,
        ),
      0,
    );
    const utilization = totalShiftHours > 0 ? (totalTaskHours / totalShiftHours) * 100 : 0;

    const completedProjects = projects.filter((p) => p.status === 'Completed');
    const onTimeProjects = completedProjects.filter(
      (p) =>
        p.promisedDate &&
        p.categories.every((c) =>
          c.subTasks.every((t) => t.completedAt && new Date(t.completedAt) <= new Date(p.promisedDate!)),
        ),
    ).length;
    const onTimeDeliveryRate =
      completedProjects.length > 0 ? (onTimeProjects / completedProjects.length) * 100 : 100;

    const activeProjects = projects.filter((p) => p.status === 'Active');
    const avgJobProgress =
      activeProjects.length > 0
        ? activeProjects.reduce((acc, p) => acc + calculateOverallProgress(p), 0) / activeProjects.length
        : 0;

    const totalTasks = projects.reduce(
      (acc, p) => acc + p.categories.reduce((cacc, c) => cacc + c.subTasks.length, 0),
      0,
    );
    const doneTasks = projects.reduce(
      (acc, p) =>
        acc + p.categories.reduce((cacc, c) => cacc + c.subTasks.filter((t) => t.status === 'Completed').length, 0),
      0,
    );

    return {
      jobProgress: `${Math.round(avgJobProgress)}%`,
      utilization: `${Math.min(utilization, 100).toFixed(0)}%`,
      onTimeDelivery: `${onTimeDeliveryRate.toFixed(0)}%`,
      tasksDone: totalTasks > 0 ? `${doneTasks}/${totalTasks}` : '0/0',
    };
  }, [projects, shifts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiDial title="Active job progress" value={stats.jobProgress} Icon={Gauge} colorClass="text-[var(--primary)]" animationDelay={0.1} />
      <KpiDial title="Workshop utilization" value={stats.utilization} Icon={BarChart3} colorClass="text-[var(--primary)]" animationDelay={0.2} />
      <KpiDial title="On-time delivery" value={stats.onTimeDelivery} Icon={CheckCircle} colorClass="text-amber-600" animationDelay={0.3} />
      <KpiDial title="Tasks completed" value={stats.tasksDone} Icon={ListChecks} colorClass="text-[var(--shark)]" animationDelay={0.4} />
    </div>
  );
};

export default KeyPerformanceIndicators;
