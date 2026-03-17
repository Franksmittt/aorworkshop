// [path]: app/(dashboard)/dashboard/page.tsx

'use client';

import { getProjects, getShifts } from '@/lib/data-service';
import KeyPerformanceIndicators from '@/components/dashboard/KeyPerformanceIndicators';
import BlockedProjects from '@/components/dashboard/BlockedProjects';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import DashboardKanban from '@/components/dashboard/DashboardKanban';
import TechnicianLiveFeed from '@/components/dashboard/TechnicianLiveFeed';
import CashFlowGauge from '@/components/dashboard/CashFlowGauge';
import ShipmentsTracker from '@/components/dashboard/ShipmentsTracker';
import LowStockAlerts from '@/components/dashboard/LowStockAlerts';
import { useAuth } from '@/app/AuthContext';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const projects = getProjects();
  const shifts = getShifts();
  const isBoss = user?.role === 'Boss';

  return (
    <div className="bento-grid">
      <header className="mb-2">
        <h1 className="text-hero text-[var(--shark)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-caption text-[var(--system-gray)] mt-1.5 max-w-xl">
          {isBoss ? 'Workshop overview, financials, and live activity.' : 'Your tasks, active jobs, and calendar at a glance.'}
        </p>
      </header>

      <KeyPerformanceIndicators projects={projects} shifts={shifts} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isBoss && <PendingApprovals projects={projects} />}
        <BlockedProjects projects={projects} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardKanban projects={projects} />
        </div>
        {isBoss ? (
          <div className="xl:col-span-1 flex flex-col gap-6">
            <CashFlowGauge />
          </div>
        ) : (
          <div className="xl:col-span-1">
            <Link href="/dashboard/calendar" className="card rounded-[var(--radius-lg)] p-6 flex items-center gap-4 hover:shadow-soft transition-samsung block">
              <Calendar className="h-10 w-10 text-[var(--primary)] shrink-0" />
              <div>
                <h3 className="text-headline text-[var(--shark)]">Calendar</h3>
                <p className="text-caption text-[var(--system-gray)] mt-0.5">What’s in workshop & coming in</p>
              </div>
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={isBoss ? 'xl:col-span-2' : 'xl:col-span-3'}>
          <TechnicianLiveFeed projects={projects} />
        </div>
        {isBoss && (
          <div className="xl:col-span-1 flex flex-col gap-6">
            <ShipmentsTracker />
            <LowStockAlerts />
          </div>
        )}
      </section>
    </div>
  );
}
