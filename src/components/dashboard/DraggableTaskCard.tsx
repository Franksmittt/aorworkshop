// [path]: components/dashboard/DraggableTaskCard.tsx

'use client';

import { UnscheduledTask, SubTask } from "@/lib/types";
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { Flame, AlertOctagon } from 'lucide-react';
import { useRef } from 'react';

// Define a type for the draggable item
export const ItemTypes = {
  TASK: 'task',
};

interface DraggableTaskCardProps {
    task: UnscheduledTask;
    onSelect: () => void;
}

const DraggableTaskCard = ({ task, onSelect }: DraggableTaskCardProps) => {
    const ref = useRef<HTMLLIElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: task,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    drag(ref);

    const getPriorityStyles = (priority: SubTask['priority']): { icon: React.ReactNode, textColor: string } => {
        switch(priority) {
            case 'Urgent': return { icon: <Flame className="h-4 w-4 text-red-400 mr-2"/>, textColor: 'text-red-400' };
            case 'High': return { icon: <AlertOctagon className="h-4 w-4 text-yellow-400 mr-2"/>, textColor: 'text-yellow-400' };
            default: return { icon: null, textColor: 'text-gray-300' };
        }
    };

    const priority = getPriorityStyles(task.priority);

    return (
        <li 
            ref={ref}
            onClick={onSelect}
            className={`p-3 bg-gray-900/50 rounded-md cursor-grab border border-transparent hover:border-red-500/50 transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        >
            <div className={`flex items-center font-semibold ${priority.textColor}`}>
                {priority.icon}
                <p>{task.name}</p>
            </div>
            <p className="text-xs text-gray-500 pl-6">{task.projectName}</p>
        </li>
    );
};

export default DraggableTaskCard;