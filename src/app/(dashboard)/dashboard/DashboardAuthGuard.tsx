// [path]: app/(dashboard)/DashboardAuthGuard.tsx

'use client';

import { useAuth } from '@/app/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the authentication check is complete and there's no user, redirect.
    if (!isLoading && !user) {
      router.push('/'); 
    }
  }, [user, isLoading, router]);

  // While checking, or if there's no user, show a loading state to prevent flashing content.
  if (isLoading || !user) {
    return (
        <div className="flex items-center justify-center h-screen bg-background text-foreground">
            <p className="text-gray-400">Authenticating...</p>
        </div>
    );
  }

  // If authenticated, render the children components (the actual dashboard).
  return <>{children}</>;
}