'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Wrench } from 'lucide-react';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { mockUsers } from '@/lib/mock-data';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = (userId: string) => {
    login(userId);
    const user = mockUsers.find((u) => u.id === userId);
    if (user?.role === 'Boss') {
      router.push('/dashboard');
    } else {
      router.push('/dashboard/my-tasks');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--athens-gray)] px-6 py-12">
      <motion.div
        className="w-full max-w-[400px] text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Eyebrow */}
        <p className="text-[var(--system-gray)] text-sm font-medium tracking-tight mb-2">
          Workshop Portal
        </p>
        {/* Hero */}
        <h1 className="text-hero text-[var(--shark)] mb-2">
          Absolute Offroad
        </h1>
        <p className="text-caption text-[var(--system-gray)] mb-10">
          4x4 Fitment Centre
        </p>

        <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-light)] shadow-[var(--shadow-soft)] p-8">
          <h2 className="text-headline text-[var(--shark)] mb-1">Sign in</h2>
          <p className="text-caption mb-6">Select who you are to continue.</p>
          <div className="flex flex-col gap-3">
            {mockUsers.map((u) => (
              <Button
                key={u.id}
                onClick={() => handleLogin(u.id)}
                variant="primary"
                size="md"
                className="w-full"
              >
                {u.role === 'Boss' ? (
                  <Briefcase className="mr-2 h-5 w-5 opacity-90" />
                ) : (
                  <Wrench className="mr-2 h-5 w-5 opacity-90" />
                )}
                {u.role === 'Boss' ? 'Jaco (Boss)' : `${u.name} (Staff)`}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
