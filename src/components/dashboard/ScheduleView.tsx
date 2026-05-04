// [path]: components/dashboard/ScheduleView.tsx

'use client';

import { Project, AssignedTask, UnscheduledTask, Technician } from '@/lib/types';
import { mockTechnicians } from '@/lib/mock-data';
import { useMemo, useState, Fragment, useRef } from 'react';
import { differenceInDays, format, addDays, eachDayOfInterval, isWithinInterval } from 'date-fns';
import JobCardModal from './JobCardModal';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { ItemTypes } from './DraggableTaskCard';

interface ScheduleViewProps {
    allProjects: Project[];
    onTaskDrop: (task: UnscheduledTask, technician: Technician, date: Date) => void;
}

const DAILY_CAPACITY = 8; // hours

const ScheduleView = ({ allProjects, onTaskDrop }: ScheduleViewProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<AssignedTask | null>(null);

    const { scheduleStartDate, totalDays, dateArray } = useMemo(() => {
        const startDate = new Date();
        const endDate = addDays(startDate, 30);
        const days = differenceInDays(endDate, startDate) + 1;
        const array = eachDayOfInterval({ start: startDate, end: endDate });
        return { scheduleStartDate: startDate, totalDays: days, dateArray: array };
    }, []);

    const scheduledTasks = useMemo(() => {
        return allProjects.flatMap(p => 
            p.categories.flatMap(c => 
                c.subTasks
                    .filter(t => t.startDate && t.dueDate && t.assignedTo)
                    .map(t => ({
                        ...t,
                        projectId: p.id,
                        projectName: `${p.car.year} ${p.car.make} ${p.car.model}`,
                        categoryName: c.name,
                        startOffset: differenceInDays(new Date(t.startDate!), scheduleStartDate),
                        duration: differenceInDays(new Date(t.dueDate!), new Date(t.startDate!)) + 1,
                    }))
            )
        );
    }, [allProjects, scheduleStartDate]);

    const workloadMap = useMemo(() => {
        const map: Record<string, number> = {};
        mockTechnicians.forEach(tech => {
            dateArray.forEach(date => {
                const dateKey = format(date, 'yyyy-MM-dd');
                const key = `${tech.id}-${dateKey}`;
                map[key] = 0;
            });
        });

        scheduledTasks.forEach(task => {
            if (!task.assignedTo || !task.startDate || !task.dueDate) return;
            const taskInterval = { start: new Date(task.startDate), end: new Date(task.dueDate) };
            const dailyHours = (task.estimateHours || 0) / (differenceInDays(taskInterval.end, taskInterval.start) + 1);

            dateArray.forEach(date => {
                if (isWithinInterval(date, taskInterval)) {
                    const dateKey = format(date, 'yyyy-MM-dd');
                    const key = `${task.assignedTo}-${dateKey}`;
                    map[key] = (map[key] || 0) + dailyHours;
                }
            });
        });

        return map;
    }, [scheduledTasks, dateArray]);

    const getWorkloadColor = (hours: number): string => {
        if (hours > DAILY_CAPACITY) return 'bg-red-900/40';
        if (hours > DAILY_CAPACITY * 0.75) return 'bg-yellow-900/40';
        return '';
    };

    const handleTaskClick = (task: AssignedTask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const ScheduleCell = ({ tech, date }: { tech: Technician, date: Date }) => {
        const ref = useRef<HTMLDivElement>(null);

        const [{ isOver }, drop] = useDrop(() => ({
            accept: ItemTypes.TASK,
            drop: (item: UnscheduledTask) => onTaskDrop(item, tech, date),
            collect: (monitor: DropTargetMonitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        drop(ref);
        
        const dateKey = format(date, 'yyyy-MM-dd');
        const workload = workloadMap[`${tech.id}-${dateKey}`] || 0;
        const bgColor = getWorkloadColor(workload);

        return (
            <div 
                ref={ref} 
                className={`border-l border-t border-gray-700 transition-colors ${bgColor} ${isOver ? 'bg-red-500/50' : ''}`} 
                style={{ gridRow: mockTechnicians.indexOf(tech) + 2, gridColumn: dateArray.indexOf(date) + 2 }}
                title={`${tech.name} on ${dateKey}: ${workload.toFixed(1)} / ${DAILY_CAPACITY} hours`}
            ></div>
        );
    };

    return (
        <>
            <div className="bg-gray-800 border border-white/10 rounded-lg p-4 overflow-x-auto h-full">
                <div className="grid gap-0 min-w-[1800px]" style={{ 
                    gridTemplateColumns: `150px repeat(${totalDays}, minmax(50px, 1fr))`,
                    gridTemplateRows: `auto repeat(${mockTechnicians.length}, 3.5rem)`
                }}>
                    <div className="sticky left-0 bg-gray-900/80 backdrop-blur-sm p-2 rounded-tl-md text-xs font-bold text-white z-20 flex items-center justify-center" style={{ gridRow: 1, gridColumn: 1 }}>Technician</div>
                    {dateArray.map((date, i) => (
                        <div key={i} className="text-center text-xs text-gray-400 border-l border-b border-gray-700 pt-2" style={{ gridRow: 1, gridColumn: i + 2 }}>
                            <p>{format(date, 'dd')}</p>
                            <p className="font-bold">{format(date, 'EEE')}</p>
                        </div>
                    ))}

                    {mockTechnicians.map((tech) => (
                        <Fragment key={tech.id}>
                            <div className="sticky left-0 bg-gray-900/80 backdrop-blur-sm p-2 text-sm font-semibold text-white z-20 flex items-center border-t border-gray-700" style={{ gridRow: mockTechnicians.indexOf(tech) + 2, gridColumn: 1 }}>
                                {tech.name}
                            </div>
                            {dateArray.map((date) => (
                                <ScheduleCell key={format(date, 'yyyy-MM-dd')} tech={tech} date={date} />
                            ))}
                        </Fragment>
                    ))}

                    {scheduledTasks.map(task => {
                        const techIndex = mockTechnicians.findIndex(t => t.id === task.assignedTo);
                        if (techIndex === -1 || task.startOffset < 0 || task.startOffset >= totalDays) return null;
                        
                        return (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task as AssignedTask)}
                                className="bg-red-600/80 hover:bg-red-500 border border-red-400 rounded p-1 text-white text-xs overflow-hidden cursor-pointer flex items-center z-10 my-1 mx-px"
                                style={{
                                    gridRow: techIndex + 2,
                                    gridColumn: `${task.startOffset + 2} / span ${Math.min(task.duration, totalDays - task.startOffset)}`,
                                }}
                                title={`${task.name} (${task.projectName})`}
                            >
                                <p className="font-bold truncate px-1">{task.name}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
            <JobCardModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                activeTimerTaskId={null}
                timerStartTime={null}
                onStartTimer={() => {}}
                onStopTimer={() => {}}
                onStatusChange={() => {}}
                onAddNote={() => {}}
            />
        </>
    );
};

export default ScheduleView;