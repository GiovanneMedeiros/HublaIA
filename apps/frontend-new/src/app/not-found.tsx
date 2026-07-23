import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-bg-primary px-6 py-16 text-neutral-white">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl font-semibold">Pagina nao encontrada</h1>
        <p className="mt-3 text-neutral-gray">
          O recurso solicitado nao existe ou foi movido.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg border border-primary-500/40 px-4 py-2 text-sm text-primary-300 hover:bg-primary-500/10"
        >
          Voltar para inicio
        </Link>
      </div>
    </main>
  );
}
