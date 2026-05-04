// [path]: app/(dashboard)/dashboard/inventory/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { getInventoryItems } from '@/lib/data-service';
import { InventoryItem } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button'; // <-- NEW IMPORT
import { Package } from 'lucide-react'; // <-- NEW IMPORT
import ShipmentsModal from '@/components/dashboard/ShipmentsModal'; // <-- NEW IMPORT

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- NEW STATE

  useEffect(() => {
    setInventory(getInventoryItems());
  }, []);

  const filteredInventory = useMemo(() => {
    if (!searchTerm) {
      return inventory;
    }
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const getStatus = (item: InventoryItem) => {
    if (item.stockQty <= 0) {
      return { text: 'Out of Stock', color: 'bg-red-900/50 text-red-300 border border-red-500/30' };
    }
    if (item.reorderPoint && item.stockQty <= item.reorderPoint) {
      return { text: 'Low Stock', color: 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' };
    }
    return { text: 'In Stock', color: 'bg-green-900/50 text-green-300 border border-green-500/30' };
  };

  return (
    <>
      <ShipmentsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Inventory Control Room</h1>
            <p className="text-gray-400">The parts division&apos;s digital warehouse and supply chain command.</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button onClick={() => setIsModalOpen(true)} variant='secondary' size='sm'>
                <Package className="h-4 w-4 mr-2"/>
                Track Shipments
            </Button>
            <Input 
              type="text"
              placeholder="Search parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        <div className="bg-gray-800 border border-white/10 rounded-lg shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Part Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Qty</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredInventory.map(item => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{item.sku}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.supplier || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">{item.stockQty}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredInventory.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500">No inventory items match your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}