'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button, Card, Input, Badge, Avatar } from '@/components/atoms';
import { authService } from '@/services/auth.service';
import {
  LogOut,
  Menu,
  X,
  Bell,
  Lock,
  Users,
  Zap,
  Moon,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await authService.getCurrentUser();
      } catch {
        router.push('/auth/login');
      }
    };

    initialize();
  }, [router]);

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

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: Users },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'integrations', label: 'Integrações', icon: Zap },
    { id: 'appearance', label: 'Aparência', icon: Moon },
  ];

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
              { label: 'Configurações', href: '/settings', active: true },
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
          <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-6xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Header */}
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold text-neutral-white">Configurações</h1>
                <p className="mt-1 text-neutral-gray">
                  Personalize sua conta e preferências
                </p>
              </motion.div>

              {/* Tabs */}
              <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-bg-secondary text-neutral-gray hover:bg-bg-tertiary'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </motion.div>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-white mb-6">
                      Informações de Perfil
                    </h2>

                    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-bg-tertiary">
                      <Avatar size="lg" fallback="AD" />
                      <div>
                        <p className="text-sm text-neutral-gray">Foto de Perfil</p>
                        <Button size="sm" variant="secondary" className="mt-2">
                          Alterar Foto
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <Input label="Nome" defaultValue="Admin Demo" />
                      <Input label="Email" defaultValue="admin@hublaia-demo.com" />
                      <Input label="Telefone" defaultValue="+55 11 98765-4321" />
                      <Input label="Empresa" defaultValue="HublaIA Demo" />
                    </div>

                    <Button className="mt-6">Salvar Alterações</Button>
                  </Card>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-white mb-6">
                      Alterar Senha
                    </h2>

                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-neutral-gray mb-2">
                          Senha Atual
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-bg-tertiary text-neutral-white"
                            placeholder="••••••••"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-neutral-white"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <Input
                        label="Nova Senha"
                        type="password"
                        placeholder="••••••••"
                      />
                      <Input
                        label="Confirmar Senha"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <Button className="mt-6">Atualizar Senha</Button>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-white mb-4">
                      Autenticação de Dois Fatores
                    </h2>
                    <p className="text-neutral-gray mb-4">
                      Aumente a segurança de sua conta ativando 2FA
                    </p>
                    <Button variant="secondary">Ativar 2FA</Button>
                  </Card>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-white mb-6">
                      Preferências de Notificações
                    </h2>

                    {[
                      {
                        title: 'Novos Leads',
                        description: 'Receba notificações de novos leads',
                        enabled: true,
                      },
                      {
                        title: 'Conversas não respondidas',
                        description: 'Alerte sobre mensagens sem resposta',
                        enabled: true,
                      },
                      {
                        title: 'Relatórios diários',
                        description: 'Receba relatórios diários por email',
                        enabled: false,
                      },
                      {
                        title: 'Atualizações do sistema',
                        description: 'Saiba sobre novos recursos',
                        enabled: true,
                      },
                    ].map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-4 border-b border-bg-tertiary last:border-0"
                      >
                        <div>
                          <p className="font-medium text-neutral-white">
                            {notification.title}
                          </p>
                          <p className="text-sm text-neutral-gray">
                            {notification.description}
                          </p>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={notification.enabled}
                            className="w-6 h-6 rounded accent-primary-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </Card>
                </motion.div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      {
                        name: 'WhatsApp Business API',
                        status: 'Conectado',
                        description: 'Integração com WhatsApp',
                        icon: '💬',
                      },
                      {
                        name: 'CRM Integrado',
                        status: 'Conectado',
                        description: 'Sincronização de dados',
                        icon: '📊',
                      },
                      {
                        name: 'Email Marketing',
                        status: 'Desconectado',
                        description: 'Campanhas por email',
                        icon: '📧',
                      },
                      {
                        name: 'Slack',
                        status: 'Desconectado',
                        description: 'Notificações no Slack',
                        icon: '🔔',
                      },
                    ].map((integration, index) => (
                      <Card
                        key={index}
                        className="p-6 flex flex-col items-center text-center"
                      >
                        <span className="text-3xl mb-3">{integration.icon}</span>
                        <h3 className="font-semibold text-neutral-white">
                          {integration.name}
                        </h3>
                        <p className="text-sm text-neutral-gray mt-1">
                          {integration.description}
                        </p>
                        <Badge
                          variant={
                            integration.status === 'Conectado' ? 'green' : 'gray'
                          }
                          size="sm"
                          className="mt-3"
                        >
                          {integration.status}
                        </Badge>
                        <Button
                          variant={
                            integration.status === 'Conectado'
                              ? 'secondary'
                              : 'primary'
                          }
                          size="sm"
                          className="mt-4"
                        >
                          {integration.status === 'Conectado'
                            ? 'Desconectar'
                            : 'Conectar'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div variants={itemVariants} className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-neutral-white mb-6">
                      Preferências de Aparência
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <p className="text-sm font-medium text-neutral-gray mb-3">
                          Tema
                        </p>
                        <div className="flex gap-3">
                          {[
                            { label: 'Dark', value: 'dark', selected: true },
                            { label: 'Light', value: 'light', selected: false },
                            { label: 'Auto', value: 'auto', selected: false },
                          ].map((option) => (
                            <button
                              key={option.value}
                              className={`px-4 py-2 rounded-lg transition-all ${
                                option.selected
                                  ? 'bg-primary-500 text-white'
                                  : 'bg-bg-secondary text-neutral-gray hover:bg-bg-tertiary'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-neutral-gray mb-3">
                          Idioma
                        </p>
                        <select className="w-full px-4 py-2 rounded-lg bg-bg-secondary border border-bg-tertiary text-neutral-white">
                          <option>Português (Brasil)</option>
                          <option>English</option>
                          <option>Español</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-neutral-gray mb-3">
                          Tamanho da Fonte
                        </p>
                        <input
                          type="range"
                          min="12"
                          max="18"
                          defaultValue="14"
                          className="w-full accent-primary-500"
                        />
                      </div>
                    </div>

                    <Button className="mt-6">Salvar Preferências</Button>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
