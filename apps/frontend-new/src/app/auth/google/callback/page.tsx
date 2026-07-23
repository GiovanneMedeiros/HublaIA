'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams?.get('error');

    if (error) {
      router.replace(`/auth/login?error=${encodeURIComponent(error)}`);
      return;
    }

    router.replace('/dashboard');
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4 text-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-gray">HublaIA</p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-white">Finalizando login com Google</h1>
        <p className="mt-2 text-sm text-neutral-gray">Você será redirecionado automaticamente.</p>
      </div>
    </div>
  );
}