// [path]: components/dashboard/ActionRequiredFeed.tsx

'use client';

import { Project } from '@/lib/types';
import { DollarSign, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface ActionRequiredFeedProps {
  projects: Project[];
}

// OPTIMIZED: Created a mapping for styles to ensure Tailwind CSS's JIT compiler
// reliably detects the classes.
const colorMap = {
  blue: {
    bg: 'bg-blue-900/50',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
  },
  purple: {
    bg: 'bg-purple-900/50',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  red: {
    bg: 'bg-red-900/50',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
};

const generateActionItems = (projects: Project[]) => {
    const items = [];
    for (const project of projects) {
        if (project.status === 'On Hold' && project.holdReason === 'Awaiting Payment') {
            items.push({
                id: `payment-${project.id}`,
                type: 'Payment',
                text: `Payment pending for ${project.car.year} ${project.car.make}.`,
                projectId: project.id,
                icon: DollarSign,
                color: 'blue' as keyof typeof colorMap,
                // This hash will now scroll the user to the financials panel
                href: `/dashboard/projects/${project.id}#financials`
            });
        }

        for (const message of project.messages) {
            if (message.visibleTo === 'BossOnly') {
                items.push({
                    id: `message-${message.id}`,
                    type: 'Message',
                    text: `New note for boss — ${project.customerName} job.`,
                    projectId: project.id,
                    icon: MessageCircle,
                    color: 'purple' as keyof typeof colorMap,
                    href: `/dashboard/projects/${project.id}#messages`
                });
            }
        }
    }
    
    // Placeholder for overdue tasks, can be made dynamic later
    items.push({
        id: `overdue-placeholder`,
        type: 'Overdue',
        text: `Mustang project is 2 weeks overdue on Engine Assembly.`,
        projectId: 'mustang-1969-smith',
        icon: Clock,
        color: 'red' as keyof typeof colorMap,
        // This hash will now scroll the user to the progress section
        href: `/dashboard/projects/mustang-1969-smith#progress`
    });

    return items;
};


const ActionRequiredFeed = ({ projects }: ActionRequiredFeedProps) => {
  const actionItems = useMemo(() => generateActionItems(projects), [projects]);

  return (
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4">Action Required</h3>
      {actionItems.length > 0 ? (
        <ul className="space-y-4">
          {actionItems.map(item => {
            const styles = colorMap[item.color];
            return (
                <li key={item.id}>
                <Link href={item.href} className="flex items-start p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.bg} ${styles.border}`}>
                        <item.icon className={`h-5 w-5 ${styles.text}`} />
                    </div>
                    <div className="ml-3">
                    <p className="text-sm font-medium text-gray-200">{item.text}</p>
                    <p className="text-xs text-gray-500">{item.type}</p>
                    </div>
                </Link>
                </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 text-center py-4">The workshop is running smoothly. No actions required.</p>
      )}
    </div>
  );
};

export default ActionRequiredFeed;