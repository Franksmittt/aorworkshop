'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const BUILD_PROJECT_ID = 'lc79-epr042gp';

/** New-project wizard disabled — single LC79 tracker only. */
export default function NewProjectRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/projects/${BUILD_PROJECT_ID}`);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-caption text-[var(--system-gray)]">Redirecting to the build…</p>
    </div>
  );
}
