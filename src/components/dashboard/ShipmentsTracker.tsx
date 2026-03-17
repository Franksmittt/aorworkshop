// [path]: components/dashboard/ShipmentsTracker.tsx

'use client';

import { Package, Plane, Anchor } from 'lucide-react';

const ShipmentsTracker = () => {
  // NOTE: This is hardcoded placeholder data.
  const shipments = [
    { id: 1, supplier: 'Summit Racing', content: 'Engine Block', status: 'In Transit', eta: 'Sep 2, 2025', icon: Plane },
    { id: 2, supplier: 'Classic Industries', content: 'Interior Kit', status: 'Customs', eta: 'Sep 5, 2025', icon: Anchor },
    { id: 3, supplier: 'NPD', content: 'Chrome Trim', status: 'In Transit', eta: 'Sep 8, 2025', icon: Plane },
  ];

  return (
    <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Package className="h-5 w-5 mr-3 text-blue-400" />
        Shipments Tracker
      </h3>
      <ul className="space-y-4">
        {shipments.map(shipment => (
          <li key={shipment.id} className="flex items-start">
            <div className="w-8 h-8 flex-shrink-0 bg-gray-700 rounded-full flex items-center justify-center mr-3">
              <shipment.icon className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <p className="font-semibold text-white">{shipment.content}</p>
              <p className="text-sm text-gray-400">From: {shipment.supplier}</p>
              <p className="text-xs font-medium text-yellow-400">ETA: {shipment.eta} ({shipment.status})</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShipmentsTracker;