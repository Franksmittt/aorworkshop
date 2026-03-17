'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PublicProjectRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <p>Redirecting...</p>
    </div>
  );
}
