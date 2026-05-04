'use client';

import { Package, Plane, Anchor } from 'lucide-react';

const ShipmentsTracker = () => {
  const shipments = [
    { id: 1, supplier: 'Summit Racing', content: 'Engine Block', status: 'In Transit', eta: 'Sep 2, 2025', icon: Plane },
    { id: 2, supplier: 'Classic Industries', content: 'Interior Kit', status: 'Customs', eta: 'Sep 5, 2025', icon: Anchor },
    { id: 3, supplier: 'NPD', content: 'Chrome Trim', status: 'In Transit', eta: 'Sep 8, 2025', icon: Plane },
  ];

  return (
    <div className="card p-6 rounded-[var(--radius-lg)]">
      <h3 className="text-headline text-[var(--shark)] mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-[var(--primary)]" />
        Shipments Tracker
      </h3>
      <ul className="space-y-4">
        {shipments.map(shipment => (
          <li key={shipment.id} className="flex items-start gap-3">
            <div className="w-10 h-10 flex-shrink-0 bg-[var(--athens-gray)] rounded-[var(--radius-md)] flex items-center justify-center">
              <shipment.icon className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[var(--shark)]">{shipment.content}</p>
              <p className="text-caption text-[var(--system-gray)]">From: {shipment.supplier}</p>
              <p className="text-xs font-medium text-[var(--warning)] mt-0.5">ETA: {shipment.eta} ({shipment.status})</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentsTracker;
