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

export default function DashboardPage() {
  const projects = getProjects();
  const shifts = getShifts();

  return (
    <div className="bento-grid">
      {/* Viewing Area — hero + primary info (top 1/3 feel) */}
      <header className="mb-2">
        <h1 className="text-hero text-[var(--shark)] tracking-tight">
          Welcome back
        </h1>
        <p className="text-caption text-[var(--system-gray)] mt-1.5 max-w-xl">
          Workshop overview. KPIs, active jobs, and live activity at a glance.
        </p>
      </header>

      {/* Bento Layer 1: KPI row — four squircle cards, 24px gutter */}
      <KeyPerformanceIndicators projects={projects} shifts={shifts} />

      {/* Bento Layer 2: Critical action — two equal modules */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovals projects={projects} />
        <BlockedProjects projects={projects} />
      </section>

      {/* Bento Layer 3: Kanban (2/3) + Cash flow (1/3) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DashboardKanban projects={projects} />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-6">
          <CashFlowGauge />
        </div>
      </section>

      {/* Bento Layer 4: Live feed (2/3) + Shipments & Stock (1/3) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TechnicianLiveFeed projects={projects} />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-6">
          <ShipmentsTracker />
          <LowStockAlerts />
        </div>
      </section>
    </div>
  );
}
