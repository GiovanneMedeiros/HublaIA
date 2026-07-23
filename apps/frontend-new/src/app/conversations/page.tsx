'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input, Button, Badge, Avatar, Card } from '@/components/atoms';
import { ChatBubble } from '@/components/molecules';
import { leadsService } from '@/services';
import { authService } from '@/services/auth.service';
import { Lead } from '@/types';
import {
  MessageSquare,
  Search,
  LogOut,
  Menu,
  X,
  Send,
  Phone,
  Info,
} from 'lucide-react';
import { STATUS_LABELS } from '@/constants';

export default function ConversationsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const initialize = async () => {
      try {
        await authService.getCurrentUser();
        await loadLeads();
      } catch {
        router.push('/auth/login');
      }
    };

    initialize();
  }, [router]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const result = await leadsService.getLeads(1, 20);
      setLeads(result?.data || []);
      if (result?.data && result.data.length > 0) {
        setSelectedLead(result.data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
  );

  const handleLogout = () => {
    authService.logout().finally(() => router.push('/auth/login'));
  };

  const aiSummary = selectedLead
    ? {
        intent: 'Busca de imóvel',
        interest: 'Alto',
        urgency: 'Média',
        sentiment: 'Positivo',
        suggestedProfessional: 'Carlos Silva',
        classification: selectedLead.classification,
      }
    : null;

  const mockMessages = selectedLead
    ? [
        {
          id: '1',
          message: 'Olá, procuro um apartamento de 2 quartos',
          sender: 'user' as const,
          timestamp: '14:30',
        },
        {
          id: '2',
          message:
            'Entendi! Um apartamento com 2 quartos. Qual é a sua faixa de preço?',
          sender: 'ai' as const,
          timestamp: '14:31',
        },
        {
          id: '3',
          message: 'Até R$ 350 mil',
          sender: 'user' as const,
          timestamp: '14:32',
        },
        {
          id: '4',
          message:
            'Perfeito! Vou encaminhar você para nosso corretor especialista em imóveis nessa faixa de preço.',
          sender: 'ai' as const,
          timestamp: '14:33',
        },
        {
          id: '5',
          message:
            'Oi! Sou Carlos, corretor especialista. Vi que você está procurando um apartamento de 2 quartos até R$ 350 mil. Tenho algumas ótimas opções para você!',
          sender: 'agent' as const,
          timestamp: '14:34',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 z-40 w-full border-b border-bg-tertiary bg-bg-primary/80 backdrop-blur-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-bg-secondary rounded-lg transition-colors lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-neutral-white">HublaIA</span>
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 text-neutral-gray hover:text-status-red" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar - Conversations List */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-80 border-r border-bg-tertiary bg-bg-secondary transition-transform duration-300 lg:relative lg:translate-x-0 z-30 overflow-y-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-4 space-y-4">
            <Input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              icon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-8 text-neutral-gray">Carregando...</div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-8 text-neutral-gray">Nenhuma conversa</div>
              ) : (
                filteredLeads.map((lead) => (
                  <motion.button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedLead?.id === lead.id
                        ? 'bg-primary-500/10 border border-primary-500/50'
                        : 'hover:bg-bg-tertiary'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar
                        size="sm"
                        fallback={lead.name.charAt(0)}
                        status="online"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-white truncate">
                          {lead.name}
                        </p>
                        <p className="text-xs text-neutral-gray truncate">
                          {lead.phone}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          <Badge
                            variant={lead.classification.toLowerCase() as any}
                            size="sm"
                          >
                            {STATUS_LABELS[
                              lead.classification as keyof typeof STATUS_LABELS
                            ]}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main - Chat */}
        <main className="flex-1 flex flex-col">
          {selectedLead ? (
            <>
              {/* Chat Header */}
              <div className="border-b border-bg-tertiary bg-bg-secondary/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar size="md" fallback={selectedLead.name.charAt(0)} />
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-white">
                        {selectedLead.name}
                      </h2>
                      <p className="text-sm text-neutral-gray">
                        {selectedLead.phone}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors">
                    <Phone className="h-5 w-5 text-neutral-gray" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {mockMessages.map((msg) => (
                  <ChatBubble key={msg.id} {...msg} />
                ))}
              </div>

              {/* Chat Input */}
              <div className="border-t border-bg-tertiary bg-bg-secondary/50 px-6 py-4">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="md"
                    icon={<Send className="h-4 w-4" />}
                    disabled={!messageInput.trim()}
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-gray">Selecione uma conversa para começar</p>
            </div>
          )}
        </main>

        {/* Sidebar Right - AI Summary */}
        {selectedLead && aiSummary && (
          <aside className="hidden xl:flex w-80 border-l border-bg-tertiary bg-bg-secondary/50 flex-col p-6 overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <Info className="h-5 w-5 text-primary-500" />
              <h3 className="font-semibold text-neutral-white">Resumo da IA</h3>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Intenção', value: aiSummary.intent },
                { label: 'Interesse', value: aiSummary.interest },
                { label: 'Urgência', value: aiSummary.urgency },
                { label: 'Sentimento', value: aiSummary.sentiment },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-medium text-neutral-gray uppercase mb-1">
                    {item.label}
                  </p>
                  <Badge variant="primary" size="sm">
                    {item.value}
                  </Badge>
                </div>
              ))}

              <div className="pt-4 border-t border-bg-tertiary">
                <p className="text-xs font-medium text-neutral-gray uppercase mb-2">
                  Profissional Indicado
                </p>
                <Card className="p-3 bg-primary-500/10 border-primary-500/20">
                  <p className="font-medium text-neutral-white">
                    {aiSummary.suggestedProfessional}
                  </p>
                  <p className="text-xs text-neutral-gray mt-1">Especialista em imóveis</p>
                </Card>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
