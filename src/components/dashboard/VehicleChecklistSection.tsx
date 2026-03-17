'use client';

import { Project } from '@/lib/types';
import { CheckCircle2, Circle, Fuel, Gauge, Key, FileText, Camera } from 'lucide-react';

interface VehicleChecklistSectionProps {
  project: Project;
}

export default function VehicleChecklistSection({ project }: VehicleChecklistSectionProps) {
  const checklist = project.vehicleChecklist;
  const numberPlate = project.car?.numberPlate;
  const photos = checklist?.photosOnArrival?.length ? checklist.photosOnArrival : [];

  return (
    <div className="card p-4 rounded-[var(--radius-lg)]">
      <h3 className="text-headline text-[var(--shark)] mb-3 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-[var(--primary)]" />
        Vehicle check-in
      </h3>
      {numberPlate && (
        <p className="text-body text-[var(--shark)] font-medium mb-2">Plate: {numberPlate}</p>
      )}
      {checklist ? (
        <ul className="space-y-2 text-sm text-[var(--shark)]">
          {checklist.mileageIn != null && (
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              <span>Mileage: {checklist.mileageIn.toLocaleString()} km</span>
            </li>
          )}
          {checklist.fuelLevel && (
            <li className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-[var(--system-gray)] flex-shrink-0" />
              <span>Fuel: {checklist.fuelLevel}</span>
            </li>
          )}
          {checklist.keysReceived != null && (
            <li className="flex items-center gap-2">
              {checklist.keysReceived ? (
                <Key className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-[var(--system-gray)] flex-shrink-0" />
              )}
              <span>Keys {checklist.keysReceived ? 'received' : 'not received'}</span>
            </li>
          )}
          {checklist.damageNoted && (
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-[var(--system-gray)] flex-shrink-0 mt-0.5" />
              <span>Damage noted: {checklist.damageNoted}</span>
            </li>
          )}
          {checklist.customerRequests && (
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-[var(--system-gray)] flex-shrink-0 mt-0.5" />
              <span>Customer requests: {checklist.customerRequests}</span>
            </li>
          )}
          {photos.length > 0 && (
            <li className="pt-2">
              <p className="text-caption text-[var(--system-gray)] flex items-center gap-1 mb-2">
                <Camera className="h-4 w-4" /> Photos on arrival ({photos.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {photos.slice(0, 6).map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-14 h-14 rounded-[var(--radius-sm)] overflow-hidden border border-[var(--border-light)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Check-in ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
                {photos.length > 6 && <span className="text-caption text-[var(--system-gray)]">+{photos.length - 6}</span>}
              </div>
            </li>
          )}
          {checklist.completedAt && (
            <li className="text-caption text-[var(--system-gray)] mt-2">
              Check-in {new Date(checklist.completedAt).toLocaleString()}
            </li>
          )}
        </ul>
      ) : (
        <p className="text-caption text-[var(--system-gray)]">No check-in recorded. Book a new vehicle to add check-in details and photos.</p>
      )}
    </div>
  );
}
