'use client';

import { Project } from '@/lib/types';
import { useState } from 'react';

interface ProjectStatusUpdaterProps {
  currentStatus: Project['status'];
  onStatusChange: (newStatus: Project['status'], holdReason: Project['holdReason']) => void;
}

const statusOptions: Project['status'][] = ['Active', 'On Hold', 'Completed'];
const holdReasonOptions: NonNullable<Project['holdReason']>[] = ['Awaiting Parts', 'Awaiting Payment', 'Awaiting Client Decision'];

const ProjectStatusUpdater = ({ currentStatus, onStatusChange }: ProjectStatusUpdaterProps) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const [holdReason, setHoldReason] = useState<Project['holdReason']>('');
  
  const handleUpdate = () => {
    if (newStatus !== currentStatus) {
      // If the status is not 'On Hold', we clear the reason. Otherwise, we pass it.
      const reasonForUpdate = newStatus === 'On Hold' ? holdReason : '';
      
      // The parent component handles creating the timeline update. We just pass the data.
      onStatusChange(newStatus, reasonForUpdate);
    }
  };
  
  return (
    <div className="space-y-4">
        <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                Project Status
            </label>
            <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as Project['status'])}
                className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white shadow-sm focus:border-red-500 focus:ring-red-500"
            >
                {statusOptions.map(option => (
                  <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                ))}
            </select>
        </div>
        
        {newStatus === 'On Hold' && (
             <div>
                <label htmlFor="holdReason" className="block text-sm font-medium text-gray-300">
                    Reason for Hold
                </label>
                <select
                    id="holdReason"
                    value={holdReason}
                    onChange={(e) => setHoldReason(e.target.value as Project['holdReason'])}
                    className="mt-1 block w-full rounded-md bg-gray-900 border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                >
                    <option value="" disabled>Select a reason...</option>
                    {holdReasonOptions.map(option => (
                      <option key={option} value={option} className="bg-gray-800 text-white">{option}</option>
                    ))}
                </select>
            </div>
        )}

        <button
            onClick={handleUpdate}
            disabled={newStatus === currentStatus || (newStatus === 'On Hold' && !holdReason)}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            Update Status
        </button>
    </div>
  );
};

export default ProjectStatusUpdater;