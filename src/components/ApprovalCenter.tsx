// [path]: components/ApprovalCenter.tsx

'use client';

import { Project } from '@/lib/types';
import { HelpCircle, ThumbsUp, ThumbsDown, DollarSign, Clock } from 'lucide-react';
import { useMemo } from 'react';
import Button from './ui/Button';
import Image from 'next/image';

interface ApprovalCenterProps {
  project: Project;
  onApproveTask: (taskId: string, categoryId: string) => void;
  onDeclineTask: (taskId: string, categoryId: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
};

const ApprovalCenter = ({ project, onApproveTask, onDeclineTask }: ApprovalCenterProps) => {
  const tasksNeedingApproval = useMemo(() => {
    return project.categories.flatMap(category =>
      category.subTasks
        .filter(task => task.requiresClientApproval && task.status === 'Awaiting Approval')
        .map(task => ({ ...task, categoryId: category.id }))
    );
  }, [project]);

  if (tasksNeedingApproval.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-900/50 border-2 border-blue-500/50 p-6 rounded-lg shadow-large my-12">
      <div className="flex items-center mb-6">
        <HelpCircle className="h-8 w-8 text-blue-300 mr-4 flex-shrink-0" />
        <div>
          <h2 className="text-2xl font-bold text-white">Decision Hub</h2>
          <p className="text-blue-200">Your input is required on the following items to keep the project moving forward.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {tasksNeedingApproval.map(task => (
          <div key={task.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white">{task.name}</h4>
            
            <div className="flex items-center text-xs text-gray-400 mt-2 space-x-4">
               {task.priceImpact != null && (
                 <span className="flex items-center">
                   <DollarSign className="w-3 h-3 mr-1.5 text-green-400"/>
                   Est. Cost: {formatCurrency(task.priceImpact)}
                 </span>
               )}
               {task.etaImpactDays != null && (
                 <span className="flex items-center">
                   <Clock className="w-3 h-3 mr-1.5 text-yellow-400"/>
                   Est. Delay: {task.etaImpactDays} Days
                 </span>
               )}
            </div>

            {task.decisionPrompt && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-300 mb-3">{task.decisionPrompt}</p>
                <div className="flex flex-wrap gap-4">
                  {task.decisionOptions?.map(option => (
                    <div key={option.name} className="flex flex-col items-center">
                      {option.imageUrl && (
                        <div className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-gray-600 mb-2">
                           <Image src={option.imageUrl} alt={option.name} fill className="object-cover" />
                        </div>
                      )}
                      <p className="text-xs font-medium text-white">{option.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex space-x-2 justify-end">
                <Button size="sm" variant="outline" onClick={() => onDeclineTask(task.id, task.categoryId)}>
                    <ThumbsDown className="w-4 h-4 mr-2"/>
                    Decline / Need More Info
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onApproveTask(task.id, task.categoryId)}>
                    <ThumbsUp className="w-4 h-4 mr-2"/>
                    Approve
                </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovalCenter;