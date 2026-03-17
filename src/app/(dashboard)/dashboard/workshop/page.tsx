'use client';

import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/data-service';
import { Project } from '@/lib/types';
import WorkshopKanban from '@/components/dashboard/WorkshopKanban';

export default function WorkshopPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // We fetch all projects to pass down to the Kanban board
        setProjects(getProjects());
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Loading Workshop Deck...</p></div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Workshop Ops Deck</h1>
                <p className="text-gray-400">A real-time view of all tasks across active projects.</p>
            </div>
            <WorkshopKanban allProjects={projects} />
        </div>
    );
}