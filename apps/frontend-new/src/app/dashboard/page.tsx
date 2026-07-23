'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Avatar } from '@/components/atoms';
import { AnalyticsChart } from '@/components/molecules';
import { leadsService, agentsService } from '@/services';
import { authService } from '@/services/auth.service';
import { onboardingService } from '@/services/onboarding.service';
import { Lead, Agent, DashboardMenuItem } from '@/types';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  Home,
  Building2,
  UserRound,
  Calendar,
  Car,
  Package,
  Bot,
  Workflow,
} from 'lucide-react';
import { STATUS_LABELS } from '@/constants';

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [menuItems, setMenuItems] = useState<DashboardMenuItem[]>([]);

  const iconByMenuKey: Record<string, any> = {
    dashboard: Home,
    conversations: MessageSquare,
    leads: Users,
    team: Users,
    queue: Workflow,
    properties: Building2,
    brokers: UserRound,
    integrations: Package,
    agent: Bot,
    settings: Settings,
    professionals: UserRound,
    services: Package,
    schedule: Calendar,
    vehicles: Car,
    inventory: Package,
    'test-drive': Car,
    products: Package,
    catalog: Package,
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await authService.getCurrentUser();
        const onboarding = await onboardingService.getState();
        if (onboarding.success && onboarding.data && !onboarding.data.progress.isCompleted) {
          router.push('/onboarding');
          return;
        }

        if (onboarding.success && onboarding.data?.menu) {
          setMenuItems(onboarding.data.menu);
        }

        await loadDashboardData();
      } catch {
        router.push('/auth/login');
      }
    };

    initialize();
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [leadsResult, agentsResult] = await Promise.all([
        leadsService.getLeads(1, 10),
        agentsService.getAgents(1, 10),
      ]);

      setLeads(leadsResult?.data || []);
      setAgents(agentsResult?.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout().finally(() => router.push('/auth/login'));
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

              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-neutral-white">HublaIA</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                <Bell className="h-5 w-5 text-neutral-gray" />
              </button>
              <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                <Settings className="h-5 w-5 text-neutral-gray" />
              </button>
              <Avatar size="sm" fallback="AD" />
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 text-neutral-gray hover:text-status-red" />
              </button>
            </div>
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
            {(menuItems.length
              ? menuItems
              : [
                  { key: 'conversations', label: 'Conversas', href: '/conversations' },
                  { key: 'leads', label: 'Leads', href: '/leads' },
                  { key: 'team', label: 'Equipe', href: '/team' },
                ]
            ).map((item) => {
              const Icon = iconByMenuKey[item.key] || MessageSquare;
              return (
              <Link key={item.key} href={item.href}>
                <button
                  className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium text-neutral-gray hover:bg-bg-tertiary hover:text-primary-500 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              </Link>
            )})}
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
                <h1 className="text-3xl font-bold text-neutral-white">Dashboard</h1>
                <p className="mt-1 text-neutral-gray">
                  Bem-vindo de volta! Aqui está um resumo do seu sistema.
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: 'Conversas Ativas',
                    value: leads.length,
                    icon: MessageSquare,
                    color: 'text-primary-500',
                  },
                  {
                    label: 'Agents Online',
                    value: agents.filter((a) => a.status === 'ONLINE').length,
                    icon: Users,
                    color: 'text-status-green',
                  },
                  {
                    label: 'Tempo Médio de Atendimento',
                    value: '2m 34s',
                    icon: Clock,
                    color: 'text-status-yellow',
                  },
                  {
                    label: 'Taxa de Conversão',
                    value: '68%',
                    icon: TrendingUp,
                    color: 'text-status-blue',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-6 hover:border-primary-500/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-gray">{stat.label}</p>
                          <p className="mt-2 text-2xl font-bold text-neutral-white">
                            {stat.value}
                          </p>
                        </div>
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Leads Section */}
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-white">Leads Recentes</h2>
                  <Button variant="secondary" size="sm">
                    Ver Todos
                  </Button>
                </div>

                <Card className="overflow-hidden">
                  {isLoading ? (
                    <div className="p-8 text-center text-neutral-gray">Carregando...</div>
                  ) : (
                    <div className="divide-y divide-bg-tertiary">
                      {leads.length === 0 ? (
                        <div className="p-8 text-center text-neutral-gray">Nenhum lead disponível</div>
                      ) : (
                        leads.map((lead) => (
                          <motion.div
                            key={lead.id}
                            variants={itemVariants}
                            className="p-4 hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <Avatar size="sm" fallback={lead.name.charAt(0)} />
                                <div className="flex-1">
                                  <p className="font-medium text-neutral-white">{lead.name}</p>
                                  <p className="text-sm text-neutral-gray">{lead.phone}</p>
                                </div>
                              </div>
                              <Badge
                                variant={lead.classification.toLowerCase() as any}
                                size="sm"
                              >
                                {STATUS_LABELS[lead.classification as keyof typeof STATUS_LABELS]}
                              </Badge>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Analytics */}
              <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
                <AnalyticsChart
                  title="Conversas por Dia"
                  data={[
                    { name: 'Seg', value: 24 },
                    { name: 'Ter', value: 13 },
                    { name: 'Qua', value: 22 },
                    { name: 'Qui', value: 8 },
                    { name: 'Sex', value: 39 },
                    { name: 'Sab', value: 22 },
                    { name: 'Dom', value: 5 },
                  ]}
                  type="line"
                  color="#4F46E5"
                />
                <AnalyticsChart
                  title="Classificação de Leads"
                  data={[
                    { name: 'Verde', value: 120 },
                    { name: 'Azul', value: 95 },
                    { name: 'Amarelo', value: 78 },
                    { name: 'Cinza', value: 42 },
                    { name: 'Vermelho', value: 18 },
                  ]}
                  type="bar"
                  color="#7C3AED"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-neutral-white">Agents Disponíveis</h2>
                  <Button variant="secondary" size="sm">
                    Ver Todos
                  </Button>
                </div>

                <motion.div
                  variants={containerVariants}
                  className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {isLoading ? (
                    <div className="text-center text-neutral-gray col-span-full">Carregando...</div>
                  ) : (
                    agents.map((agent) => (
                      <motion.div key={agent.id} variants={itemVariants}>
                        <Card className="p-6 hover:border-primary-500/50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <Avatar size="md" fallback={agent.name.charAt(0)} status={agent.status.toLowerCase() as any} />
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
                              {agent.status}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-neutral-white">{agent.name}</h3>
                          <p className="text-xs text-neutral-gray mt-1">{agent.title || 'Agent'}</p>
                          <div className="mt-4 space-y-2 text-sm">
                            <p className="text-neutral-gray">
                              Conversas: <span className="text-neutral-white font-medium">{agent.currentConversations}/{agent.maxConcurrent}</span>
                            </p>
                            <p className="text-neutral-gray">
                              Total: <span className="text-neutral-white font-medium">{agent.totalLeads}</span>
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
