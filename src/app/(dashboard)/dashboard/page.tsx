// [path]: app/(dashboard)/dashboard/page.tsx

'use client';

import Link from 'next/link';
import { getProjectById } from '@/lib/data-service';
import { calculateOverallProgress } from '@/lib/utils';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuth } from '@/app/AuthContext';
import { Camera, Car } from 'lucide-react';

const BUILD_PROJECT_ID = 'lc79-epr042gp';

export default function DashboardPage() {
  const { user } = useAuth();
  const project = getProjectById(BUILD_PROJECT_ID);
  const progress = project ? calculateOverallProgress(project) : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-hero text-[var(--shark)] tracking-tight">LC79 build</h1>
        <p className="text-caption text-[var(--system-gray)] mt-1.5">
          {user?.role === 'Boss' ? 'Cobra Fire · EPR042GP — single job tracker.' : 'Track progress and photos for this vehicle.'}
        </p>
      </header>

      {project ? (
        <div className="card rounded-[var(--radius-lg)] p-6 md:p-8 border border-[var(--border-light)]">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-headline text-[var(--shark)]">
                {project.car.year} {project.car.make} {project.car.model}
              </h2>
              <p className="text-caption text-[var(--system-gray)] mt-1">{project.customerName} · {project.car.numberPlate}</p>
            </div>
            <span className="text-2xl font-bold text-[var(--primary)] shrink-0">{Math.round(progress)}%</span>
          </div>
          <ProgressBar progress={progress} />
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/dashboard/projects/${BUILD_PROJECT_ID}`}
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--primary)] text-white px-5 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Car className="h-5 w-5" />
              Open build progress
            </Link>
            <Link
              href="/dashboard/media"
              className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-light)] bg-white px-5 py-3 text-sm font-semibold text-[var(--shark)] hover:bg-[var(--athens-gray)] transition-colors"
            >
              <Camera className="h-5 w-5 text-[var(--primary)]" />
              Media &amp; photos
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-caption text-[var(--system-gray)]">Project data not found. Use Reset in the sidebar, then reload.</p>
      )}
    </div>
  );
}
