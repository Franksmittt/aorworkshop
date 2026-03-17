'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface KpiDialProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  colorClass: string;
  animationDelay: number;
}

const KpiDial = ({ title, value, Icon, colorClass, animationDelay }: KpiDialProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: animationDelay, ease: [0.22, 0.25, 0, 1] }}
      className="card p-6 flex flex-col justify-between min-h-[120px]"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-subhead text-[var(--shark)]">{title}</h3>
        <Icon className={`h-6 w-6 shrink-0 ${colorClass}`} />
      </div>
      <p className={`text-3xl font-semibold tracking-tight mt-2 ${colorClass}`}>{value}</p>
    </motion.div>
  );
};

export default KpiDial;
