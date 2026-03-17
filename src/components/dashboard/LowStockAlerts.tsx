// [path]: components/dashboard/LowStockAlerts.tsx

'use client';

import { Archive, AlertTriangle } from 'lucide-react';

const LowStockAlerts = () => {
    // NOTE: This is hardcoded placeholder data.
    const lowStockItems = [
        { id: 'LS-1', name: 'Brake Pads (Set)', partNumber: 'DP-3000', stock: 2, reorderPoint: 5 },
        { id: 'LS-2', name: '10W-40 Synthetic Oil (L)', partNumber: 'SYN-10W40', stock: 18, reorderPoint: 20 },
        { id: 'LS-3', name: 'V-Belt 7PK1795', partNumber: 'BLT-7PK1795', stock: 1, reorderPoint: 3 },
    ];

    return (
        <div className="bg-gray-800 border border-white/10 p-6 rounded-lg shadow-soft">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Archive className="h-5 w-5 mr-3 text-yellow-400" />
                Low Stock Alerts
            </h3>
            <ul className="space-y-3">
                {lowStockItems.map(item => (
                    <li key={item.id} className="bg-gray-900/50 p-3 rounded-md">
                        <p className="font-semibold text-white text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.partNumber}</p>
                        <div className="flex items-center text-sm text-red-400 mt-1 font-bold">
                           <AlertTriangle className="h-4 w-4 mr-2" />
                           <span>In Stock: {item.stock} (Re-order at {item.reorderPoint})</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LowStockAlerts;