import Link from 'next/link';

export default function Legacy404Page() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1220', color: '#fff', padding: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>Pagina nao encontrada</h1>
        <p style={{ color: '#94a3b8', marginBottom: 16 }}>A rota solicitada nao existe.</p>
        <Link href="/" style={{ color: '#7dd3fc' }}>Voltar para inicio</Link>
      </div>
    </main>
  );
}
