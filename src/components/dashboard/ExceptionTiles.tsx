// [path]: components/dashboard/ExceptionTiles.tsx

'use client';

import { Project } from "@/lib/types";
import { AlertTriangle, Clock, UserX, CalendarClock } from "lucide-react";
import { useMemo } from "react";

interface ExceptionTilesProps {
    projects: Project[];
    // --- NEW: Add the click handler prop ---
    onTileClick: (title: string, filteredProjects: Project[]) => void;
}

const ExceptionTile = ({ icon: Icon, title, value, colorClass, onClick }: { icon: React.ElementType, title: string, value: number, colorClass: string, onClick?: () => void }) => {
    if (value === 0) return null;

    return (
        <div 
            onClick={onClick}
            className={`bg-gray-800 border-l-4 ${colorClass} p-4 rounded-r-lg shadow-soft flex items-center transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-r-4 hover:border-y-4 hover:border-red-500/50 hover:bg-gray-700/50' : ''}`}
        >
            <Icon className={`h-8 w-8 mr-4 ${colorClass.replace('border-', 'text-')}`} />
            <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-400">{title}</p>
            </div>
        </div>
    );
};


const ExceptionTiles = ({ projects, onTileClick }: ExceptionTilesProps) => {

    // --- NEW: This now stores the project lists, not just the lengths ---
    const exceptions = useMemo(() => {
        const onHold = projects.filter(p => p.status === 'On Hold');
        const atRisk = projects.filter(p => {
            if (!p.promisedDate || p.status === 'Completed') return false;
            return new Date(p.promisedDate) < new Date();
        });

        // These don't map to a simple project list, so they won't be clickable for now.
        const overdueApprovalsCount = projects.reduce((acc, p) => acc + p.categories.reduce((catAcc, cat) => catAcc + cat.subTasks.filter(t => t.requiresClientApproval && t.status === 'Awaiting Approval').length, 0), 0);
        const urgentUnassignedCount = projects.reduce((acc, p) => acc + p.categories.reduce((catAcc, cat) => catAcc + cat.subTasks.filter(t => t.priority === 'Urgent' && !t.assignedTo).length, 0), 0);

        return { onHold, atRisk, overdueApprovalsCount, urgentUnassignedCount };
    }, [projects]);

    const hasExceptions = exceptions.onHold.length > 0 || exceptions.atRisk.length > 0 || exceptions.overdueApprovalsCount > 0 || exceptions.urgentUnassignedCount > 0;

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Exception Radar</h2>
            {hasExceptions ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ExceptionTile
                        icon={Clock}
                        title="Projects On Hold"
                        value={exceptions.onHold.length}
                        colorClass="border-yellow-500"
                        onClick={() => onTileClick('Projects On Hold', exceptions.onHold)}
                    />
                    <ExceptionTile
                        icon={AlertTriangle}
                        title="Pending Approvals"
                        value={exceptions.overdueApprovalsCount}
                        colorClass="border-blue-500"
                    />
                    <ExceptionTile
                        icon={UserX}
                        title="Urgent Unassigned"
                        value={exceptions.urgentUnassignedCount}
                        colorClass="border-red-500"
                    />
                    <ExceptionTile
                        icon={CalendarClock}
                        title="Projects At Risk"
                        value={exceptions.atRisk.length}
                        colorClass="border-purple-500"
                        onClick={() => onTileClick('Projects At Risk', exceptions.atRisk)}
                    />
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-800 rounded-lg border border-white/10">
                    <p className="text-gray-400">No critical exceptions found. The workshop is running smoothly.</p>
                </div>
            )}
        </div>
    );
};

export default ExceptionTiles;