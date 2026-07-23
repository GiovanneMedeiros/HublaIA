'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input, Badge, Avatar, Card } from '@/components/atoms';
import { agentsService } from '@/services';
import { authService } from '@/services/auth.service';
import { Agent } from '@/types';
import {
  Search,
  LogOut,
  Menu,
  X,
  Plus,
  Star,
  Zap,
} from 'lucide-react';

export default function TeamPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await authService.getCurrentUser();
        await loadAgents();
      } catch {
        router.push('/auth/login');
      }
    };

    initialize();
  }, [router]);

  useEffect(() => {
    let filtered = agents;

    if (searchQuery) {
      filtered = filtered.filter((agent) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((agent) => agent.status === selectedStatus);
    }

    setFilteredAgents(filtered);
  }, [agents, searchQuery, selectedStatus]);

  const loadAgents = async () => {
    try {
      setIsLoading(true);
      const result = await agentsService.getAgents(1, 50);
      setAgents(result?.data || []);
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout().finally(() => router.push('/auth/login'));
  };

  const stats = [
    { label: 'Total', value: agents.length },
    {
      label: 'Online',
      value: agents.filter((a) => a.status === 'ONLINE').length,
      color: 'text-status-green',
    },
    {
      label: 'Ocupados',
      value: agents.filter((a) => a.status === 'BUSY').length,
      color: 'text-status-yellow',
    },
    {
      label: 'Offline',
      value: agents.filter((a) => a.status === 'OFFLINE').length,
      color: 'text-status-gray',
    },
  ];

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return 'Online';
      case 'BUSY':
        return 'Ocupado';
      case 'AWAY':
        return 'Ausente';
      default:
        return 'Offline';
    }
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
              { label: 'Equipe', href: '/team', active: true },
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-white">Equipe</h1>
                    <p className="mt-1 text-neutral-gray">
                      Gerencie sua equipe de profissionais
                    </p>
                  </div>
                  <Button size="md" icon={<Plus className="h-4 w-4" />}>
                    Adicionar Membro
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <p className="text-sm text-neutral-gray">{stat.label}</p>
                    <p
                      className={`mt-2 text-2xl font-bold ${
                        stat.color || 'text-neutral-white'
                      }`}
                    >
                      {stat.value}
                    </p>
                  </Card>
                ))}
              </motion.div>

              {/* Filters and Search */}
              <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
                <Input
                  type="text"
                  placeholder="Buscar por nome..."
                  icon={<Search className="h-4 w-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-xs"
                />
                <div className="flex gap-2">
                  {[
                    { label: 'Todos', value: 'all' },
                    { label: 'Online', value: 'ONLINE' },
                    { label: 'Ocupados', value: 'BUSY' },
                    { label: 'Offline', value: 'OFFLINE' },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={selectedStatus === filter.value ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedStatus(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Agents Grid */}
              <motion.div
                variants={containerVariants}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {isLoading ? (
                  <div className="text-center py-8 text-neutral-gray col-span-full">
                    Carregando...
                  </div>
                ) : filteredAgents.length === 0 ? (
                  <div className="text-center py-8 text-neutral-gray col-span-full">
                    Nenhum membro encontrado
                  </div>
                ) : (
                  filteredAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="p-6 hover:border-primary-500/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                          <Avatar
                            size="lg"
                            fallback={agent.name.charAt(0)}
                            status={agent.status.toLowerCase() as any}
                          />
                          <Badge
                            variant={
                              agent.status === 'ONLINE'
                                ? 'green'
                                : agent.status === 'BUSY'
                                  ? 'yellow'
                                  : 'gray'
                            }
                            size="sm"
                          >
                            {getStatusLabel(agent.status)}
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-neutral-white">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-neutral-gray mt-1">
                          {agent.title || 'Profissional'}
                        </p>

                        <div className="mt-4 space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-gray">Conversas</span>
                            <span className="font-medium text-neutral-white">
                              {agent.currentConversations}/{agent.maxConcurrent}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-gray">Total de Atendimentos</span>
                            <span className="font-medium text-neutral-white">
                              {agent.totalLeads}
                            </span>
                          </div>
                          {agent.averageRating && (
                            <div className="flex items-center justify-between">
                              <span className="text-neutral-gray">Avaliação</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-status-yellow fill-status-yellow" />
                                <span className="font-medium text-neutral-white">
                                  {agent.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {agent.isAvailable && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-status-green">
                            <Zap className="h-3 w-3" />
                            Disponível
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
