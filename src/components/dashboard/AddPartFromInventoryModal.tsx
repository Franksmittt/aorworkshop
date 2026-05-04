// [path]: components/dashboard/AddPartFromInventoryModal.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getInventoryItems } from '@/lib/data-service';
import { InventoryItem, Part } from '@/lib/types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddPartFromInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partData: Omit<Part, 'id' | 'taskId' | 'status'>) => void;
}

const AddPartFromInventoryModal = ({ isOpen, onClose, onSave }: AddPartFromInventoryModalProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setInventory(getInventoryItems());
      // Reset state on open
      setSearchTerm('');
      setSelectedItem(null);
      setQuantity(1);
    }
  }, [isOpen]);

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory;
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const handleSave = () => {
    if (!selectedItem || quantity <= 0) {
      alert('Please select a part and enter a valid quantity.');
      return;
    }
    onSave({
      name: selectedItem.name,
      partNumber: selectedItem.sku,
      supplier: selectedItem.supplier,
      qty: quantity,
      unitCost: selectedItem.unitCost,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-gray-800 border border-white/10 w-full max-w-2xl rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-xl font-bold text-white">Add Part From Inventory</h2>
            </div>
            <div className="p-6 border-y border-gray-700 space-y-4">
              <Input
                placeholder="Search inventory by name or SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <div className="h-48 overflow-y-auto bg-gray-900/50 rounded-md border border-gray-700">
                {filteredInventory.map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3 cursor-pointer flex justify-between items-center ${selectedItem?.id === item.id ? 'bg-red-600 text-white' : 'hover:bg-gray-700/50'}`}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.sku}</p>
                    </div>
                    <p className="text-sm text-gray-400">Stock: {item.stockQty}</p>
                  </div>
                ))}
              </div>
              {selectedItem && (
                <div className="grid grid-cols-3 gap-4 items-center bg-gray-900/50 p-3 rounded-md">
                  <p className="col-span-2 font-semibold text-white">Selected: {selectedItem.name}</p>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    className="text-center"
                  />
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg">
              <Button onClick={onClose} variant="secondary" size="sm">Cancel</Button>
              <Button onClick={handleSave} variant="primary" size="sm" disabled={!selectedItem}>Add Part to Task</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPartFromInventoryModal;