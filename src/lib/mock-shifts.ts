// [path]: lib/mock-shifts.ts

import { Shift } from './types';
import { subDays, setHours, setMinutes } from 'date-fns';

const today = new Date();

// Helper to create consistent date objects
const createShiftTime = (dayOffset: number, hour: number, minute: number) => {
    return setMinutes(setHours(subDays(today, dayOffset), hour), minute).toISOString();
};

export const mockShifts: Shift[] = [
  // Mike L. (user-tech-1) - A busy week
  { id: 'shift-1', userId: 'user-tech-1', clockInTime: createShiftTime(4, 8, 0), clockOutTime: createShiftTime(4, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(4, 12, 0), endTime: createShiftTime(4, 12, 30) }] }, // Monday
  { id: 'shift-2', userId: 'user-tech-1', clockInTime: createShiftTime(3, 8, 5), clockOutTime: createShiftTime(3, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(3, 12, 0), endTime: createShiftTime(3, 13, 0) }] }, // Tuesday
  { id: 'shift-7', userId: 'user-tech-1', clockInTime: createShiftTime(2, 7, 55), clockOutTime: createShiftTime(2, 16, 30), breaks: [{ type: 'Lunch', startTime: createShiftTime(2, 12, 0), endTime: createShiftTime(2, 12, 30) }] }, // Wednesday
  { id: 'shift-8', userId: 'user-tech-1', clockInTime: createShiftTime(1, 8, 0), clockOutTime: createShiftTime(1, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(1, 12, 30), endTime: createShiftTime(1, 13, 0) }] }, // Thursday
  
  // Chris P. (user-tech-2) - A full week
  { id: 'shift-3', userId: 'user-tech-2', clockInTime: createShiftTime(4, 8, 15), clockOutTime: createShiftTime(4, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(4, 12, 30), endTime: createShiftTime(4, 13, 0) }] }, // Monday
  { id: 'shift-10', userId: 'user-tech-2', clockInTime: createShiftTime(3, 8, 0), clockOutTime: createShiftTime(3, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(3, 12, 0), endTime: createShiftTime(3, 12, 30) }] }, // Tuesday
  { id: 'shift-4', userId: 'user-tech-2', clockInTime: createShiftTime(2, 8, 0), clockOutTime: createShiftTime(2, 18, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(2, 12, 0), endTime: createShiftTime(2, 12, 30) }] }, // Wednesday

  // James M. (user-tech-3) - Some days & a past shift
  { id: 'shift-5', userId: 'user-tech-3', clockInTime: createShiftTime(1, 9, 0), clockOutTime: createShiftTime(1, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(1, 13, 0), endTime: createShiftTime(1, 13, 30) }] }, // Thursday
  { id: 'shift-14', userId: 'user-tech-3', clockInTime: createShiftTime(0, 8, 0), clockOutTime: createShiftTime(0, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(0, 12, 0), endTime: createShiftTime(0, 12, 30) }] }, // Friday (Today)
  
  // Data from previous months for "All Time" filter
  { id: 'shift-6', userId: 'user-tech-3', clockInTime: createShiftTime(35, 8, 0), clockOutTime: createShiftTime(35, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(35, 12, 0), endTime: createShiftTime(35, 12, 30) }] },
  { id: 'shift-15', userId: 'user-tech-1', clockInTime: createShiftTime(40, 8, 0), clockOutTime: createShiftTime(40, 17, 0), breaks: [{ type: 'Lunch', startTime: createShiftTime(40, 12, 0), endTime: createShiftTime(40, 12, 30) }] },
];