// [path]: app/(dashboard)/dashboard/parts/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/data-service';
import { Project } from '@/lib/types';
import PartsBoard from '@/components/dashboard/PartsBoard';

export default function PartsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setProjects(getProjects());
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Loading Parts Hub...</p></div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Parts & Procurement Hub</h1>
                <p className="text-gray-400">A global overview of all parts required for active jobs.</p>
            </div>
            <PartsBoard allProjects={projects} />
        </div>
    );
}