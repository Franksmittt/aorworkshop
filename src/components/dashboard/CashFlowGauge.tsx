// [path]: components/dashboard/CashFlowGauge.tsx

'use client';

import { DollarSign } from 'lucide-react'; // 'AlertCircle' was unused and has been removed.
import { useMemo } from 'react';

const CashFlowGauge = () => {
  // NOTE: This is hardcoded placeholder data.
  const cashOnHand = 285000;
  const upcomingExpenses = 190000; // Payroll, parts orders, etc.

  const { ratio, colorClass, label } = useMemo(() => {
    const safeThreshold = 0.5; // Green above 50%
    const warningThreshold = 0.25; // Yellow above 25%

    const net = cashOnHand - upcomingExpenses;
    const ratio = cashOnHand > 0 ? net / cashOnHand : 0;
    
    if (ratio > safeThreshold) {
      return { ratio, colorClass: 'bg-green-500', label: 'Healthy' };
    }
    if (ratio > warningThreshold) {
      return { ratio, colorClass: 'bg-yellow-500', label: 'Caution' };
    }
    return { ratio, colorClass: 'bg-red-500', label: 'Critical' };
  }, [cashOnHand, upcomingExpenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <DollarSign className="h-5 w-5 mr-3 text-green-400" />
        Cash Flow
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm font-medium text-gray-300">Net Position</span>
            <span className={`font-bold text-lg ${colorClass.replace('bg-', 'text-')}`}>{label}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className={`h-4 rounded-full transition-all duration-500 ease-out ${colorClass}`} style={{ width: `${Math.max(0, ratio * 100)}%` }}></div>
          </div>
        </div>
        <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
          <p><strong>Cash on Hand:</strong> {formatCurrency(cashOnHand)}</p>
          <p><strong>Upcoming Expenses:</strong> {formatCurrency(upcomingExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowGauge;