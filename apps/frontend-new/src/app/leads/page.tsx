'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Input, Badge, Avatar, Card } from '@/components/atoms';
import { leadsService } from '@/services';
import { authService } from '@/services/auth.service';
import { Lead } from '@/types';
import {
  Search,
  LogOut,
  Menu,
  X,
  Plus,
  Download,
} from 'lucide-react';
import { STATUS_LABELS } from '@/constants';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  useEffect(() => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery) ||
          lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.classification === selectedFilter);
    }

    setFilteredLeads(filtered);
  }, [leads, searchQuery, selectedFilter]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const result = await leadsService.getLeads(1, 50);
      setLeads(result?.data || []);
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout().finally(() => router.push('/auth/login'));
  };

  const stats = [
    { label: 'Total', value: leads.length, color: 'text-neutral-gray' },
    {
      label: 'Verde',
      value: leads.filter((l) => l.classification === 'GREEN').length,
      color: 'text-status-green',
    },
    {
      label: 'Azul',
      value: leads.filter((l) => l.classification === 'BLUE').length,
      color: 'text-status-blue',
    },
    {
      label: 'Vermelho',
      value: leads.filter((l) => l.classification === 'RED').length,
      color: 'text-status-red',
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
              { label: 'Leads', href: '/leads', active: true },
              { label: 'Equipe', href: '/team' },
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
                    <h1 className="text-3xl font-bold text-neutral-white">Leads</h1>
                    <p className="mt-1 text-neutral-gray">
                      Gerencie todos os seus leads em um só lugar
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
                      Exportar
                    </Button>
                    <Button size="md" icon={<Plus className="h-4 w-4" />}>
                      Novo Lead
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-4">
                    <p className="text-sm text-neutral-gray">{stat.label}</p>
                    <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </Card>
                ))}
              </motion.div>

              {/* Filters and Search */}
              <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
                <Input
                  type="text"
                  placeholder="Buscar por nome, email ou telefone..."
                  icon={<Search className="h-4 w-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 min-w-xs"
                />
                <div className="flex gap-2">
                  {[
                    { label: 'Todos', value: 'all' },
                    { label: 'Verde', value: 'GREEN' },
                    { label: 'Azul', value: 'BLUE' },
                    { label: 'Amarelo', value: 'YELLOW' },
                  ].map((filter) => (
                    <Button
                      key={filter.value}
                      variant={selectedFilter === filter.value ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedFilter(filter.value)}
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Leads Table */}
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden">
                  {isLoading ? (
                    <div className="p-8 text-center text-neutral-gray">Carregando...</div>
                  ) : filteredLeads.length === 0 ? (
                    <div className="p-8 text-center text-neutral-gray">
                      Nenhum lead encontrado
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-bg-tertiary bg-bg-tertiary/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-gray">
                              Nome
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-gray">
                              Telefone
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-gray">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-gray">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-neutral-gray">
                              Classificação
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-bg-tertiary">
                          {filteredLeads.map((lead) => (
                            <motion.tr
                              key={lead.id}
                              variants={itemVariants}
                              className="hover:bg-bg-tertiary/50 transition-colors cursor-pointer"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    size="sm"
                                    fallback={lead.name.charAt(0)}
                                  />
                                  <span className="font-medium text-neutral-white">
                                    {lead.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-neutral-gray">
                                {lead.phone}
                              </td>
                              <td className="px-6 py-4 text-neutral-gray">
                                {lead.email || '-'}
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant={
                                    lead.status === 'NEW'
                                      ? 'primary'
                                      : lead.status === 'ASSIGNED'
                                        ? 'green'
                                        : 'gray'
                                  }
                                  size="sm"
                                >
                                  {lead.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge
                                  variant={lead.classification.toLowerCase() as any}
                                  size="sm"
                                >
                                  {STATUS_LABELS[
                                    lead.classification as keyof typeof STATUS_LABELS
                                  ]}
                                </Badge>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
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
