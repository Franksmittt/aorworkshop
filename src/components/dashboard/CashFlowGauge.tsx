'use client';

import { DollarSign } from 'lucide-react';
import { useMemo } from 'react';

const CashFlowGauge = () => {
  const cashOnHand = 285000;
  const upcomingExpenses = 190000;

  const { ratio, colorClass, label } = useMemo(() => {
    const safeThreshold = 0.5;
    const warningThreshold = 0.25;
    const net = cashOnHand - upcomingExpenses;
    const ratio = cashOnHand > 0 ? net / cashOnHand : 0;
    if (ratio > safeThreshold) {
      return { ratio, colorClass: 'bg-[var(--success)]', label: 'Healthy' };
    }
    if (ratio > warningThreshold) {
      return { ratio, colorClass: 'bg-[var(--warning)]', label: 'Caution' };
    }
    return { ratio, colorClass: 'bg-[var(--error)]', label: 'Critical' };
  }, [cashOnHand, upcomingExpenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="card p-6 rounded-[var(--radius-lg)] h-full">
      <h3 className="text-headline text-[var(--shark)] mb-4 flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-[var(--primary)]" />
        Cash Flow
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-caption text-[var(--system-gray)]">Net Position</span>
            <span className="text-subhead text-[var(--shark)]">{label}</span>
          </div>
          <div className="w-full bg-[var(--fill)] rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 transition-samsung ${colorClass}`}
              style={{ width: `${Math.max(0, ratio * 100)}%` }}
            />
          </div>
        </div>
        <div className="text-caption text-[var(--system-gray)] pt-2 border-t border-[var(--border-light)]">
          <p><strong className="text-[var(--shark)]">Cash on Hand:</strong> {formatCurrency(cashOnHand)}</p>
          <p><strong className="text-[var(--shark)]">Upcoming Expenses:</strong> {formatCurrency(upcomingExpenses)}</p>
        </div>
      </div>
    </div>
  );
};

export default CashFlowGauge;
