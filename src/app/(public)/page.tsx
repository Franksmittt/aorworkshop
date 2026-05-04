'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Wrench, Lock } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { mockUsers } from '@/lib/mock-data';

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [userId, setUserId] = useState<string>(mockUsers[0]?.id ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = login(userId, password);
    if (!ok) {
      setError('Wrong PIN for this person.');
      return;
    }
    const user = mockUsers.find((u) => u.id === userId);
    if (user?.role === 'Boss') {
      router.push('/dashboard');
    } else {
      router.push('/dashboard/projects');
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
        <p className="text-[var(--system-gray)] text-sm font-medium tracking-tight mb-2">Workshop Portal</p>
        <h1 className="text-hero text-[var(--shark)] mb-2">Absolute Offroad</h1>
        <p className="text-caption text-[var(--system-gray)] mb-10">4x4 Fitment Centre</p>

        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[var(--radius-lg)] border border-[var(--border-light)] shadow-[var(--shadow-soft)] p-8 text-left"
        >
          <h2 className="text-headline text-[var(--shark)] mb-1 text-center">Sign in</h2>
          <p className="text-caption mb-6 text-center">Choose who you are and enter your PIN.</p>

          <label className="block text-sm font-medium text-[var(--shark)] mb-2">Person</label>
          <div className="flex flex-col gap-2 mb-5">
            {mockUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setUserId(u.id);
                  setError(null);
                }}
                className={`flex items-center gap-3 w-full rounded-[var(--radius-md)] border-2 px-4 py-3 text-left transition-samsung ${
                  userId === u.id
                    ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                    : 'border-[var(--border-light)] hover:border-[var(--border)] hover:bg-[var(--athens-gray)]'
                }`}
              >
                {u.role === 'Boss' ? (
                  <Briefcase className="h-5 w-5 text-[var(--primary)] shrink-0" />
                ) : (
                  <Wrench className="h-5 w-5 text-[var(--system-gray)] shrink-0" />
                )}
                <span className="font-medium text-[var(--shark)]">
                  {u.role === 'Boss' ? 'Jaco (Boss)' : `${u.name} (Staff)`}
                </span>
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium text-[var(--shark)] mb-2">PIN</label>
          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--system-gray)]" />
            <Input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              className="pl-10"
              placeholder="Enter PIN"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
          </div>

          {error && <p className="text-sm text-red-600 mb-4 text-center">{error}</p>}

          <Button type="submit" variant="primary" size="md" className="w-full">
            Continue
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
