'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import ClockInOut from './ClockInOut';
import { useAuth } from '@/app/AuthContext';

const BUILD_HREF = '/dashboard/projects/lc79-epr042gp';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? '?';

  return (
    <header className="flex-shrink-0 h-14 bg-white border-b border-[var(--border-light)] px-4 flex items-center justify-between gap-4">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 text-[var(--system-gray)] hover:text-[var(--shark)] rounded-[var(--radius-sm)] transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 flex justify-center max-w-xl mx-auto">
        <Link
          href={BUILD_HREF}
          className="text-sm font-medium text-[var(--shark)] hover:text-[var(--primary)] transition-colors truncate px-2"
        >
          LC79 · EPR042GP · Cobra Fire
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <ClockInOut />
        <div
          className="w-8 h-8 rounded-full bg-[var(--athens-gray)] flex items-center justify-center text-sm font-semibold text-[var(--shark)]"
          aria-hidden
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
