// [path]: components/dashboard/ShipmentsModal.tsx

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Plane, Anchor, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface ShipmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShipmentsModal = ({ isOpen, onClose }: ShipmentsModalProps) => {
  // NOTE: This is the same hardcoded placeholder data from the dashboard widget.
  const shipments = [
    { id: 1, orderNum: 'USA-84621', supplier: 'Summit Racing', content: 'Engine Block & Heads', status: 'In Transit', eta: 'Sep 2, 2025', icon: Plane, location: 'Departed JFK Airport, NY' },
    { id: 2, orderNum: 'USA-84622', supplier: 'Classic Industries', content: 'Full Interior & Carpet Kit', status: 'Customs', eta: 'Sep 5, 2025', icon: Anchor, location: 'Awaiting clearance at Durban Port' },
    { id: 3, orderNum: 'DE-19945', supplier: 'NPD', content: 'Complete Chrome Trim Set', status: 'In Transit', eta: 'Sep 8, 2025', icon: Plane, location: 'Departed Frankfurt Airport, DE' },
    { id: 4, orderNum: 'LOCAL-5512', supplier: 'Brake Corp', content: 'Brake Pads (x10)', status: 'Delivered', eta: 'Aug 29, 2025', icon: CheckCircle, location: 'Signed for at reception' },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'Delivered') return 'text-green-400';
    if (status === 'Customs') return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-gray-800 border border-white/10 w-full max-w-4xl h-[80vh] rounded-lg shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-gray-900/50 flex justify-between items-center border-b border-white/10 flex-shrink-0">
              <h2 className="text-xl font-bold text-white flex items-center"><Package className="mr-3"/>Shipment Tracking</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button>
            </div>
            <div className="p-6 flex-grow overflow-y-auto">
                <ul className="space-y-4">
                    {shipments.map(shipment => (
                        <li key={shipment.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col sm:flex-row">
                            <div className="flex items-center sm:border-r border-gray-700 sm:pr-4 mb-3 sm:mb-0">
                                <shipment.icon className={`h-8 w-8 mr-4 flex-shrink-0 ${getStatusColor(shipment.status)}`} />
                                <div>
                                    <p className="font-bold text-white">{shipment.content}</p>
                                    <p className="text-sm text-gray-400">From: {shipment.supplier}</p>
                                    <p className="text-xs text-gray-500 font-mono">{shipment.orderNum}</p>
                                </div>
                            </div>
                            <div className="sm:pl-4 flex-grow">
                                <p className={`text-sm font-bold ${getStatusColor(shipment.status)}`}>{shipment.status}</p>
                                <p className="text-sm text-gray-300">{shipment.location}</p>
                                <p className="text-xs text-gray-500 mt-1">Estimated Delivery: {shipment.eta}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 bg-gray-900/50 flex justify-end space-x-2 rounded-b-lg border-t border-gray-700 flex-shrink-0">
              <Button onClick={onClose} variant="secondary" size="sm">Close</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShipmentsModal;