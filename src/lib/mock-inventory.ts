// [path]: lib/mock-inventory.ts

import { InventoryItem } from './types';
export const mockInventory: InventoryItem[] = [
  { id: 'inv-001', sku: 'FLT-OIL-01', name: 'Premium Oil Filter', stockQty: 25, reorderPoint: 10, supplier: 'Auto Parts Pro', unitCost: 150 },
  { id: 'inv-002', sku: 'BRK-PAD-45', name: 'Ceramic Brake Pads (Set)', stockQty: 8, reorderPoint: 10, supplier: 'Brake Corp', unitCost: 800 },
  { id: 'inv-003', sku: 'SPK-PLG-B6', name: 'Spark Plug (V8 Set)', stockQty: 15, reorderPoint: 5, supplier: 'Ignition Inc.', unitCost: 450 },
  { id: 'inv-004', sku: 'SYN-OIL-5W30', name: '5W-30 Synthetic Oil (5L)', stockQty: 32, reorderPoint: 15, supplier: 'Auto Parts Pro', unitCost: 550 },
  { id: 'inv-005', sku: 'FLT-AIR-12', name: 'Performance Air Filter', stockQty: 0, reorderPoint: 5, supplier: 'Speed Systems', unitCost: 700 },
  { id: 'inv-006', sku: 'BLT-SRP-7PK', name: 'Serpentine Belt 7PK1855', stockQty: 9, reorderPoint: 8, supplier: 'Belt Masters', unitCost: 250 },
  { id: 'inv-007', sku: 'GKT-VLV-SBC', name: 'Valve Cover Gasket (SBC)', stockQty: 12, reorderPoint: 10, supplier: 'Seals & Gaskets', unitCost: 350 },
  { id: 'inv-008', sku: 'FUS-STD-10A', name: '10A Blade Fuse (50 pack)', stockQty: 5, reorderPoint: 5, supplier: 'Ignition Inc.', unitCost: 100 },
];