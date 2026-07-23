'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 text-neutral-white">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-semibold">Algo deu errado</h1>
        <p className="mt-3 text-neutral-gray">
          Ocorreu um erro inesperado. Tente novamente.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-primary-500/40 px-4 py-2 text-sm text-primary-300 hover:bg-primary-500/10"
          >
            Tentar novamente
          </button>
          <Link
            href="/"
            className="rounded-lg border border-bg-tertiary px-4 py-2 text-sm text-neutral-gray hover:bg-bg-secondary"
          >
            Ir para inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
