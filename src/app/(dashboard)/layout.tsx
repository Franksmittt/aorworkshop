// [path]: app/(dashboard)/layout.tsx

'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardAuthGuard from './DashboardAuthGuard';
import { TimeTrackingProvider } from './TimeTrackingContext'; // <-- Import the new provider

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <DashboardAuthGuard>
      <TimeTrackingProvider> {/* <-- Wrap the content in the provider */}
        <div className="flex h-screen bg-[var(--athens-gray)] text-[var(--shark)]">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 overflow-y-auto">
              <div className="container-content py-8 md:py-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </TimeTrackingProvider>
    </DashboardAuthGuard>
  );
}