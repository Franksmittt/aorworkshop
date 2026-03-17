'use client';

import { Archive, AlertTriangle } from 'lucide-react';

const LowStockAlerts = () => {
  const lowStockItems = [
    { id: 'LS-1', name: 'Brake Pads (Set)', partNumber: 'DP-3000', stock: 2, reorderPoint: 5 },
    { id: 'LS-2', name: '10W-40 Synthetic Oil (L)', partNumber: 'SYN-10W40', stock: 18, reorderPoint: 20 },
    { id: 'LS-3', name: 'V-Belt 7PK1795', partNumber: 'BLT-7PK1795', stock: 1, reorderPoint: 3 },
  ];

  return (
    <div className="card p-6 rounded-[var(--radius-lg)]">
      <h3 className="text-headline text-[var(--shark)] mb-4 flex items-center gap-2">
        <Archive className="h-5 w-5 text-[var(--warning)]" />
        Low Stock Alerts
      </h3>
      <ul className="space-y-3">
        {lowStockItems.map(item => (
          <li key={item.id} className="bg-[var(--athens-gray)] p-3 rounded-[var(--radius-md)] border border-[var(--border-light)]">
            <p className="font-semibold text-[var(--shark)] text-sm">{item.name}</p>
            <p className="text-caption text-[var(--system-gray)]">{item.partNumber}</p>
            <div className="flex items-center gap-2 text-sm text-[var(--error)] font-semibold mt-1">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>In Stock: {item.stock} (Re-order at {item.reorderPoint})</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockAlerts;
