// [path]: app/(dashboard)/TimeTrackingContext.tsx

'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/app/AuthContext';
import * as dataService from '@/lib/data-service';
import { BreakType } from '@/lib/types';

type Status = 'ClockedIn' | 'ClockedOut' | 'OnBreak';

interface TimeTrackingContextType {
  status: Status;
  shiftId: string | null;
  breakType: BreakType | null;
  handleClockIn: () => void;
  handleClockOut: () => void;
  handleStartBreak: (type: BreakType) => void;
  handleEndBreak: () => void;
}

const TimeTrackingContext = createContext<TimeTrackingContextType | undefined>(undefined);

export const TimeTrackingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>('ClockedOut');
  const [shiftId, setShiftId] = useState<string | null>(null);
  const [breakType, setBreakType] = useState<BreakType | null>(null);

  const fetchStatus = useCallback(() => {
    if (user) {
      const { status, shiftId, breakType } = dataService.getUserTimeTrackingStatus(user.id);
      setStatus(status);
      setShiftId(shiftId);
      setBreakType(breakType);
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleClockIn = () => {
    if (user) {
      dataService.clockIn(user.id);
      fetchStatus();
    }
  };

  const handleClockOut = () => {
    if (shiftId) {
      dataService.clockOut(shiftId);
      fetchStatus();
    }
  };

  const handleStartBreak = (type: BreakType) => {
    if (shiftId) {
      dataService.startBreak(shiftId, type);
      fetchStatus();
    }
  };
  
  const handleEndBreak = () => {
    if (shiftId) {
      dataService.endBreak(shiftId);
      fetchStatus();
    }
  };

  return (
    <TimeTrackingContext.Provider value={{ status, shiftId, breakType, handleClockIn, handleClockOut, handleStartBreak, handleEndBreak }}>
      {children}
    </TimeTrackingContext.Provider>
  );
};

export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (context === undefined) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
};