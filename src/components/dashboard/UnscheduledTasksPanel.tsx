// [path]: components/dashboard/UnscheduledTasksPanel.tsx

'use client';

import { UnscheduledTask } from "@/lib/types";
// Corrected import path to be more robust
import DraggableTaskCard from "@/components/dashboard/DraggableTaskCard";

interface UnscheduledTasksPanelProps {
    tasks: UnscheduledTask[];
    onTaskSelect: (task: UnscheduledTask) => void;
}

const UnscheduledTasksPanel = ({ tasks, onTaskSelect }: UnscheduledTasksPanelProps) => {
    return (
        <div className="bg-gray-800 border border-white/10 rounded-lg h-full flex flex-col">
            <div className="p-4 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Task Backlog</h3>
                <p className="text-xs text-gray-400">Drag tasks onto the schedule</p>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
                {tasks.length > 0 ? (
                    <ul className="space-y-2">
                        {tasks.map(task => (
                            <DraggableTaskCard 
                                key={task.id} 
                                task={task} 
                                onSelect={() => onTaskSelect(task)}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-500 italic">No unscheduled tasks.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnscheduledTasksPanel;