'use client';

import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const ToggleSwitch = ({ enabled, setEnabled }: ToggleSwitchProps) => {
  return (
    <div
      onClick={() => setEnabled(!enabled)}
      className={`flex items-center w-12 h-6 rounded-full cursor-pointer transition-colors ${
        enabled ? 'bg-red-600 justify-end' : 'bg-gray-300 justify-start'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full shadow-md"
      />
    </div>
  );
};

export default ToggleSwitch;