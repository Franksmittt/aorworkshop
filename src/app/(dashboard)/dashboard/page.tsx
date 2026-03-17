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
  // In a real app, these would be fetched once and passed down or managed by a state manager.
  const projects = getProjects();
  const shifts = getShifts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-hero text-[var(--shark)]">Welcome back</h1>
        <p className="text-caption text-[var(--system-gray)] mt-1">Workshop overview.</p>
      </div>

      {/* Layer 1, Top Row: The Racing Dials */}
      <KeyPerformanceIndicators projects={projects} shifts={shifts} />

      {/* Layer 1, Second Row: Critical Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingApprovals projects={projects} />
        <BlockedProjects projects={projects} />
      </div>

      {/* Main Body (Two Columns): Live Telemetry & Financial/Supply Chain */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <DashboardKanban projects={projects} />
          <TechnicianLiveFeed projects={projects} />
        </div>
        <div className="xl:col-span-1 space-y-8">
          <CashFlowGauge />
          <ShipmentsTracker />
          <LowStockAlerts />
        </div>
      </div>
    </div>
  );
}