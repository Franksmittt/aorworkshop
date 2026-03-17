'use client';

import { Project } from '@/lib/types';
import { CheckCircle2, Circle, Fuel, Gauge, Key, FileText } from 'lucide-react';

interface VehicleChecklistSectionProps {
  project: Project;
}

export default function VehicleChecklistSection({ project }: VehicleChecklistSectionProps) {
  const checklist = project.vehicleChecklist;

  return (
    <div className="bg-background border border-border rounded p-4 shadow-soft">
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <Gauge className="h-5 w-5 text-copper" />
        Vehicle check-in
      </h3>
      {checklist ? (
        <ul className="space-y-2 text-sm text-foreground">
          {checklist.mileageIn != null && (
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
              <span>Mileage: {checklist.mileageIn.toLocaleString()} km</span>
            </li>
          )}
          {checklist.fuelLevel && (
            <li className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-copper flex-shrink-0" />
              <span>Fuel: {checklist.fuelLevel}</span>
            </li>
          )}
          {checklist.keysReceived != null && (
            <li className="flex items-center gap-2">
              {checklist.keysReceived ? (
                <Key className="h-4 w-4 text-accent flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-muted flex-shrink-0" />
              )}
              <span>Keys {checklist.keysReceived ? 'received' : 'not received'}</span>
            </li>
          )}
          {checklist.damageNoted && (
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-copper flex-shrink-0 mt-0.5" />
              <span>Damage noted: {checklist.damageNoted}</span>
            </li>
          )}
          {checklist.customerRequests && (
            <li className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-copper flex-shrink-0 mt-0.5" />
              <span>Customer requests: {checklist.customerRequests}</span>
            </li>
          )}
          {checklist.completedAt && (
            <li className="text-muted text-xs mt-2">
              Completed {new Date(checklist.completedAt).toLocaleString()}
            </li>
          )}
        </ul>
      ) : (
        <p className="text-muted text-sm">No check-in completed yet. Add one when the vehicle arrives.</p>
      )}
    </div>
  );
}
