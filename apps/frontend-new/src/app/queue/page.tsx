'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge, Avatar, Card } from '@/components/atoms';
import { leadsService } from '@/services';
import { authService } from '@/services/auth.service';
import { Lead } from '@/types';
import {
  LogOut,
  Menu,
  X,
  GripVertical,
  TrendingUp,
} from 'lucide-react';
import { STATUS_LABELS } from '@/constants';

export default function QueuePage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [queue, setQueue] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedItem, setDraggedItem] = useState<Lead | null>(null);

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
      const result = await leadsService.getLeads(1, 50);
      const leadsData = result?.data || [];
      setLeads(leadsData);
      // Simular fila com os 5 primeiros leads
      setQueue(leadsData.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout().finally(() => router.push('/auth/login'));
  };

  const handleDragStart = (lead: Lead) => {
    setDraggedItem(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (index: number) => {
    if (!draggedItem) return;

    const currentIndex = queue.findIndex((l) => l.id === draggedItem.id);
    if (currentIndex === -1) return;

    const newQueue = [...queue];
    newQueue.splice(currentIndex, 1);
    newQueue.splice(index, 0, draggedItem);
    setQueue(newQueue);
    setDraggedItem(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

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
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-bg-tertiary bg-bg-secondary transition-transform duration-300 lg:relative lg:translate-x-0 z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <nav className="space-y-2 p-4">
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Conversas', href: '/conversations' },
              { label: 'Leads', href: '/leads' },
              { label: 'Equipe', href: '/team' },
              { label: 'Fila', href: '/queue', active: true },
            ].map((item, index) => (
              <Link key={index} href={item.href}>
                <button
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                      : 'text-neutral-gray hover:bg-bg-tertiary'
                  }`}
                >
                  {item.label}
                </button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={itemVariants}>
                <div>
                  <h1 className="text-3xl font-bold text-neutral-white">Fila de Atendimento</h1>
                  <p className="mt-1 text-neutral-gray">
                    Ordene os leads e gerencie a fila de atendimento
                  </p>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Total na Fila', value: queue.length, icon: '📋' },
                  {
                    label: 'Urgentes',
                    value: queue.filter((l) => l.classification === 'RED').length,
                    icon: '🔴',
                  },
                  {
                    label: 'Qualificados',
                    value: queue.filter((l) => l.classification === 'GREEN').length,
                    icon: '🟢',
                  },
                ].map((stat, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-gray">{stat.label}</p>
                        <p className="mt-2 text-2xl font-bold text-neutral-white">
                          {stat.value}
                        </p>
                      </div>
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                  </Card>
                ))}
              </motion.div>

              {/* Queue */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-white mb-4">
                    Fila Atual - Arraste para reordenar
                  </h2>

                  {isLoading ? (
                    <div className="text-center py-8 text-neutral-gray">Carregando...</div>
                  ) : queue.length === 0 ? (
                    <div className="text-center py-8 text-neutral-gray">Fila vazia</div>
                  ) : (
                    <div className="space-y-2">
                      {queue.map((lead, index) => (
                        <motion.div
                          key={lead.id}
                          draggable
                          onDragStart={() => handleDragStart(lead)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(index)}
                          className="p-4 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary cursor-move transition-all border border-bg-tertiary hover:border-primary-500/30"
                          whileHover={{ x: 4 }}
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical className="h-5 w-5 text-neutral-gray flex-shrink-0" />
                            <Avatar
                              size="sm"
                              fallback={lead.name.charAt(0)}
                              status="online"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-neutral-white">{lead.name}</p>
                              <p className="text-xs text-neutral-gray">{lead.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={lead.classification.toLowerCase() as any}
                                size="sm"
                              >
                                {STATUS_LABELS[
                                  lead.classification as keyof typeof STATUS_LABELS
                                ]}
                              </Badge>
                              <span className="text-sm font-bold text-primary-500">
                                #{index + 1}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Available Leads */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-white mb-4">
                    Leads Disponíveis
                  </h2>

                  {isLoading ? (
                    <div className="text-center py-8 text-neutral-gray">Carregando...</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-8 text-neutral-gray">Nenhum lead</div>
                  ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {leads
                        .filter((lead) => !queue.find((q) => q.id === lead.id))
                        .slice(0, 6)
                        .map((lead) => (
                          <motion.div
                            key={lead.id}
                            className="p-3 rounded-lg bg-bg-tertiary/50 hover:bg-bg-tertiary transition-all cursor-pointer border border-bg-tertiary hover:border-primary-500/30"
                            whileHover={{ y: -2 }}
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
                                <p className="text-xs text-neutral-gray">{lead.phone}</p>
                                <div className="mt-2 flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-status-green" />
                                  <span className="text-xs text-neutral-gray">
                                    Pontuação: {lead.qualificationScore}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
