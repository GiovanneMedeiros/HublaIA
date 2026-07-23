'use client';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-bg-primary px-6 py-16 text-neutral-white">
        <main className="mx-auto max-w-xl text-center">
          <h1 className="text-4xl font-semibold">Falha critica</h1>
          <p className="mt-3 text-neutral-gray">
            Nao foi possivel carregar a aplicacao neste momento.
          </p>
          <p className="mt-4 text-xs text-neutral-gray/80">
            {error.message}
          </p>
        </main>
      </body>
    </html>
  );
}
