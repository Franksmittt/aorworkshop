'use client';

import { useMemo } from 'react';
import { getProjects } from '@/lib/data-service';
import { mockTechnicians } from '@/lib/mock-data';
import Link from 'next/link';
import { addDays, format, parseISO } from 'date-fns';
import { Car, Calendar as CalendarIcon, Users, Wrench } from 'lucide-react';

export default function CalendarPage() {
  const projects = useMemo(() => getProjects(), []);

  const inWorkshopNow = useMemo(
    () => projects.filter((p) => p.status === 'Active' || p.status === 'Awaiting QC'),
    [projects]
  );

  const comingIn = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const twoWeeksEnd = addDays(today, 14);
    return projects
      .filter((p) => {
        if (!p.promisedDate) return false;
        const d = new Date(p.promisedDate);
        return d >= start && d <= twoWeeksEnd;
      })
      .sort((a, b) => (a.promisedDate && b.promisedDate ? new Date(a.promisedDate).getTime() - new Date(b.promisedDate).getTime() : 0));
  }, [projects]);

  const getWhoIsWorking = (project: (typeof projects)[0]) => {
    const names = new Set<string>();
    project.categories.forEach((cat) => {
      cat.subTasks.forEach((task) => {
        if (task.status === 'In Progress' && task.assignedTo) {
          const tech = mockTechnicians.find((t) => t.id === task.assignedTo);
          if (tech) names.add(tech.name);
        }
      });
    });
    return Array.from(names);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-hero text-[var(--shark)] tracking-tight">Calendar</h1>
        <p className="text-caption text-[var(--system-gray)] mt-1.5">
          What’s in the workshop now and what’s coming in the next two weeks.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-title text-[var(--shark)] mb-4 flex items-center gap-2">
          <Wrench className="h-6 w-6 text-[var(--primary)]" />
          In workshop now
        </h2>
        {inWorkshopNow.length === 0 ? (
          <div className="card rounded-[var(--radius-lg)] p-8 text-center">
            <p className="text-[var(--system-gray)]">No jobs currently in the workshop.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {inWorkshopNow.map((project) => {
              const who = getWhoIsWorking(project);
              return (
                <li key={project.id}>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="card rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-soft transition-samsung block"
                  >
                    <div>
                      <p className="font-semibold text-[var(--shark)]">
                        {project.car.year} {project.car.make} {project.car.model}
                        {project.car.numberPlate && <span className="text-[var(--system-gray)] font-normal ml-2">({project.car.numberPlate})</span>}
                      </p>
                      <p className="text-caption text-[var(--system-gray)]">{project.customerName}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {who.length > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)]">
                          <Users className="h-4 w-4" />
                          {who.join(', ')}
                        </span>
                      )}
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        project.status === 'Awaiting QC' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' : 'bg-[var(--success)]/10 text-green-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-title text-[var(--shark)] mb-4 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-[var(--primary)]" />
          Coming in (next 2 weeks)
        </h2>
        {comingIn.length === 0 ? (
          <div className="card rounded-[var(--radius-lg)] p-8 text-center">
            <p className="text-[var(--system-gray)]">Nothing scheduled in the next 14 days.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {comingIn.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="card rounded-[var(--radius-lg)] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-soft transition-samsung block"
                >
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-[var(--system-gray)] shrink-0" />
                    <div>
                      <p className="font-semibold text-[var(--shark)]">
                        {project.car.year} {project.car.make} {project.car.model}
                      </p>
                      <p className="text-caption text-[var(--system-gray)]">{project.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {project.promisedDate && (
                      <span className="text-sm font-medium text-[var(--shark)]">
                        {format(parseISO(project.promisedDate), 'EEE, d MMM')}
                      </span>
                    )}
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      project.status === 'Awaiting QC' ? 'bg-[var(--primary)]/10 text-[var(--primary)]' :
                      project.status === 'Active' ? 'bg-[var(--success)]/10 text-green-700' : 'bg-[var(--athens-gray)] text-[var(--system-gray)]'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
