// [path]: components/dashboard/ActionRequiredFeed.tsx

'use client';

import { Project } from '@/lib/types';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

interface ActionRequiredFeedProps {
  projects: Project[];
}

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
  const items: {
    id: string;
    type: string;
    text: string;
    projectId: string;
    icon: typeof MessageCircle;
    color: keyof typeof colorMap;
    href: string;
  }[] = [];

  for (const project of projects) {
    for (const message of project.messages) {
      if (message.visibleTo === 'BossOnly') {
        items.push({
          id: `message-${message.id}`,
          type: 'Message',
          text: `New note for boss — ${project.customerName} job.`,
          projectId: project.id,
          icon: MessageCircle,
          color: 'purple',
          href: `/dashboard/projects/${project.id}#messages`,
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
          {actionItems.map((item) => {
            const styles = colorMap[item.color];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] border ${styles.bg} ${styles.border}`}
                >
                  <item.icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.text}`} />
                  <div>
                    <p className="font-semibold text-[var(--shark)]">{item.type}</p>
                    <p className="text-sm text-[var(--system-gray)] mt-0.5">{item.text}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-caption text-[var(--system-gray)]">Nothing needs your attention right now.</p>
      )}
    </div>
  );
};

export default ActionRequiredFeed;
