// [path]: components/dashboard/AiSuggestions.tsx

'use client';

import { Lightbulb, DollarSign, UserCheck } from 'lucide-react';
import Link from 'next/link';

const AiSuggestions = () => {
    // NOTE: This is hardcoded mock data demonstrating what an AI would suggest.
    const suggestions = [
        {
            id: 'sug-1',
            title: "Unlock Project '69 Mustang",
            description: "The project is blocked awaiting a client decision on the paint shade. Follow up with John Smith to prevent further delays.",
            icon: UserCheck,
            color: 'text-blue-400',
            href: '/dashboard/projects/mustang-1969-smith'
        },
        {
            id: 'sug-2',
            title: "Improve Profitability on Camaro Project",
            description: "The '69 Camaro project currently has a low estimated margin. Review material costs or consider a quote adjustment for any new client requests.",
            icon: DollarSign,
            color: 'text-green-400',
            href: '/dashboard/financials'
        },
        {
            id: 'sug-3',
            title: "Optimize Technician Workload",
            description: "James M. has high utilization this week, while Chris P. has available capacity. Consider reassigning upcoming 'Pending' tasks to balance the workload.",
            icon: Lightbulb,
            color: 'text-yellow-400',
            href: '/dashboard/technicians'
        },
    ];

    return (
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft h-full">
            <h3 className="text-xl font-bold text-white mb-4">Top AI Suggestions</h3>
            <ul className="space-y-4">
                {suggestions.map(sug => (
                    <li key={sug.id}>
                        <Link href={sug.href} className="block p-4 rounded-md bg-gray-900/50 hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-start">
                                <sug.icon className={`h-5 w-5 mr-4 mt-1 flex-shrink-0 ${sug.color}`} />
                                <div>
                                    <p className="font-semibold text-white">{sug.title}</p>
                                    <p className="text-sm text-gray-400">{sug.description}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AiSuggestions;