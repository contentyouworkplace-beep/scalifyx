'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupSuccess() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/plans?checkout=1');
  }, [router]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
