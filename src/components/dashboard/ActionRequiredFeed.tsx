// [path]: components/dashboard/ActionRequiredFeed.tsx

'use client';

import { Project } from '@/lib/types';
import { DollarSign, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface ActionRequiredFeedProps {
  projects: Project[];
}

// OPTIMIZED: Created a mapping for styles to ensure Tailwind CSS's JIT compiler
// reliably detects the classes.
const colorMap = {
  blue: {
    bg: 'bg-[var(--primary)]/10',
    border: 'border-[var(--primary)]/30',
    text: 'text-[var(--primary)]',
  },
  purple: {
    bg: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-700',
  },
  red: {
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
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
    
    return items;
};


const ActionRequiredFeed = ({ projects }: ActionRequiredFeedProps) => {
  const actionItems = useMemo(() => generateActionItems(projects), [projects]);

  return (
    <div className="card p-6 rounded-[var(--radius-lg)]">
      <h3 className="text-headline text-[var(--shark)] mb-4">Action required</h3>
      {actionItems.length > 0 ? (
        <ul className="space-y-3">
          {actionItems.map(item => {
            const styles = colorMap[item.color];
            return (
              <li key={item.id}>
                <Link href={item.href} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--athens-gray)] transition-colors">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center ${styles.bg} ${styles.border}`}>
                    <item.icon className={`h-5 w-5 ${styles.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--shark)]">{item.text}</p>
                    <p className="text-xs text-[var(--system-gray)]">{item.type}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-caption text-[var(--system-gray)] text-center py-4">No actions required.</p>
      )}
    </div>
  );
};

export default ActionRequiredFeed;