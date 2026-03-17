// [path]: components/dashboard/ClockInOut.tsx

'use client';

import { useState } from 'react';
import { useTimeTracking } from '@/app/(dashboard)/TimeTrackingContext';
import { BreakType } from '@/lib/types';
import { LogIn, LogOut, Coffee, Sandwich, Play } from 'lucide-react'; // CORRECTED: Added 'Play' icon
import Button from '../ui/Button';

export default function ClockInOut() {
    const { status, breakType, handleClockIn, handleClockOut, handleStartBreak, handleEndBreak } = useTimeTracking();
    const [isBreakMenuOpen, setIsBreakMenuOpen] = useState(false);

    const onStartBreak = (type: BreakType) => {
        handleStartBreak(type);
        setIsBreakMenuOpen(false);
    };

    const getStatusIndicator = () => {
        switch (status) {
            case 'ClockedIn': return { text: 'Clocked In', color: 'bg-green-500' };
            case 'OnBreak': return { text: `On Break (${breakType})`, color: 'bg-yellow-500' };
            case 'ClockedOut': return { text: 'Clocked Out', color: 'bg-gray-500' };
        }
    };

    const { text, color } = getStatusIndicator();

    return (
        <div className="relative flex items-center space-x-3">
            <div className="flex items-center">
                <span className={`relative flex h-3 w-3 mr-2`}>
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
                </span>
                <span className="text-sm text-gray-300">{text}</span>
            </div>

            {status === 'ClockedOut' && (
                <Button onClick={handleClockIn} size="sm" variant="secondary"><LogIn className="h-4 w-4 mr-2"/>Clock In</Button>
            )}

            {status === 'ClockedIn' && (
                <div className="flex space-x-2">
                    <div className="relative">
                        <Button onClick={() => setIsBreakMenuOpen(prev => !prev)} size="sm" variant="secondary"><Coffee className="h-4 w-4 mr-2"/>Start Break</Button>
                        {isBreakMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 border border-white/10 rounded-md shadow-lg z-10">
                                <a onClick={() => onStartBreak('Lunch')} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 cursor-pointer"><Sandwich className="h-4 w-4 mr-2"/>Lunch</a>
                                <a onClick={() => onStartBreak('Tea')} className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 cursor-pointer"><Coffee className="h-4 w-4 mr-2"/>Tea</a>
                            </div>
                        )}
                    </div>
                    <Button onClick={handleClockOut} size="sm" variant="outline"><LogOut className="h-4 w-4 mr-2"/>Clock Out</Button>
                </div>
            )}

            {status === 'OnBreak' && (
                <Button onClick={handleEndBreak} size="sm" variant="primary"><Play className="h-4 w-4 mr-2"/>End Break</Button>
            )}
        </div>
    );
}