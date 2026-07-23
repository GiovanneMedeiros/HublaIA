'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Badge } from '@/components/atoms';
import { onboardingService } from '@/services/onboarding.service';
import { PropertyProvider } from '@/types';

export default function RealEstatePropertyProvidersPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<PropertyProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await onboardingService.getRealEstateProviders();
        if (!response.success || !response.data) {
          throw new Error('Falha ao carregar providers');
        }
        setProviders(response.data);
      } catch {
        setError('Nao foi possivel carregar as opcoes de integracao agora.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const handleProviderAction = async (provider: PropertyProvider) => {
    if (provider.available) {
      return;
    }

    if (provider.key === 'other' || provider.key === 'sobressai') {
      await onboardingService.requestPropertyProvider(provider.key);
      const response = await onboardingService.getRealEstateProviders();
      if (response.success && response.data) {
        setProviders(response.data);
      }
      return;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary px-4 py-10 text-neutral-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Conecte seus imoveis</h1>
            <p className="mt-2 text-sm text-neutral-gray">
              Escolha como deseja disponibilizar seus imoveis para o HublaIA.
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/onboarding')}>
            Voltar ao onboarding
          </Button>
        </div>

        {error && (
          <div className="rounded-lg border border-status-red/30 bg-status-red/10 p-3 text-sm text-status-red">
            {error}
          </div>
        )}

        {isLoading ? (
          <Card className="p-6">Carregando integracoes...</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => (
              <Card key={provider.key} className="p-5 border border-bg-tertiary">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold">{provider.name}</h2>
                  <Badge variant={provider.available ? 'green' : 'yellow'} size="sm">
                    {provider.statusText}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-gray">{provider.description}</p>
                <Button
                  className="mt-4"
                  variant="secondary"
                  onClick={() => handleProviderAction(provider)}
                >
                  {provider.actionLabel}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


