'use client';

import { useState } from 'react';
import { Project } from '@/lib/types';
import Button from '@/components/ui/Button';

interface ProjectStatusUpdaterProps {
  currentStatus: Project['status'];
  onStatusChange: (newStatus: Project['status'], holdReason: Project['holdReason']) => void;
}

const statusOptions: Project['status'][] = ['Active', 'On Hold', 'Awaiting QC', 'Completed'];
const holdReasonOptions: NonNullable<Project['holdReason']>[] = ['Awaiting Parts', 'Awaiting Payment', 'Awaiting Client Decision', 'Internal QA'];

const ProjectStatusUpdater = ({ currentStatus, onStatusChange }: ProjectStatusUpdaterProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [holdReason, setHoldReason] = useState<Project['holdReason']>('');

  const handleUpdate = () => {
    if (newStatus !== currentStatus) {
      const reasonForUpdate = newStatus === 'On Hold' ? holdReason : '';
      onStatusChange(newStatus, reasonForUpdate);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-[var(--shark)]">
          Project status
        </label>
        <select
          id="status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as Project['status'])}
          className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-2 text-[var(--shark)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {newStatus === 'On Hold' && (
        <div>
          <label htmlFor="holdReason" className="block text-sm font-medium text-[var(--shark)]">
            Reason for hold
          </label>
          <select
            id="holdReason"
            value={holdReason}
            onChange={(e) => setHoldReason(e.target.value as Project['holdReason'])}
            className="mt-1 block w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-white px-4 py-2 text-[var(--shark)] focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">Select a reason...</option>
            {holdReasonOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      )}

      <Button
        onClick={handleUpdate}
        disabled={newStatus === currentStatus || (newStatus === 'On Hold' && !holdReason)}
        className="w-full"
      >
        Update status
      </Button>
    </div>
  );
};

export default ProjectStatusUpdater;