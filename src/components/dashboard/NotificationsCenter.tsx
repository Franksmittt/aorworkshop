// [path]: components/dashboard/NotificationsCenter.tsx

'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckSquare, MessageSquare, AlertTriangle } from 'lucide-react';
import { getProjects } from '@/lib/data-service';
import Link from 'next/link';

type NotificationType = 'Approval' | 'Message' | 'Blocked';

interface Notification {
  id: string;
  type: NotificationType;
  text: string;
  subtext: string;
  href: string;
  icon: React.ElementType;
}

const NotificationsCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const notifications = useMemo(() => {
    const allProjects = getProjects();
    const items: Notification[] = [];

    allProjects.forEach(project => {
      // Pending Approvals
      project.categories.forEach(category => {
        category.subTasks.forEach(task => {
          if (task.status === 'Awaiting Approval') {
            items.push({
              id: `approval-${task.id}`,
              type: 'Approval',
              text: `Approval needed: "${task.name}"`,
              subtext: `${project.car.year} ${project.car.make} ${project.car.model}`,
              href: `/dashboard/projects/${project.id}#progress`,
              icon: CheckSquare,
            });
          }
        });
      });

      // Recent messages (from staff)
      const recentMessages = project.messages.filter(m => m.authorRole === 'Staff');
      if (recentMessages.length > 0) {
        const latestMessage = recentMessages.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        items.push({
            id: `message-${latestMessage.id}`,
            type: 'Message',
            text: `New note — ${project.customerName}`,
            subtext: `"${latestMessage.text.substring(0, 30)}..."`,
            href: `/dashboard/projects/${project.id}#messages`,
            icon: MessageSquare,
        });
      }

      // Blocked Projects
      if (project.status === 'On Hold') {
        items.push({
            id: `blocked-${project.id}`,
            type: 'Blocked',
            text: `Project is blocked`,
            subtext: `Reason: ${project.holdReason}`,
            href: `/dashboard/projects/${project.id}`,
            icon: AlertTriangle,
        });
      }
    });

    return items.slice(0, 10); // Limit to 10 most recent for performance
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative text-gray-400 hover:text-white">
        <Bell className="h-6 w-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-20"
          >
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-semibold text-white">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map(item => {
                    const colors = {
                        Approval: 'text-blue-400',
                        Message: 'text-purple-400',
                        Blocked: 'text-red-400',
                    }
                    return (
                        <li key={item.id}>
                            <Link 
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-start p-3 hover:bg-gray-700/50"
                            >
                                <item.icon className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 ${colors[item.type]}`} />
                                <div>
                                    <p className="text-sm text-white">{item.text}</p>
                                    <p className="text-xs text-gray-400">{item.subtext}</p>
                                </div>
                            </Link>
                        </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="p-4 text-center text-sm text-gray-500">No new notifications.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsCenter;