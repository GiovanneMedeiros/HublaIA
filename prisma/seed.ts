import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes se houver
  console.log('🧹 Limpando dados existentes...');
  await prisma.lead.deleteMany({});
  await prisma.agent.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.queue.deleteMany({});
  await prisma.company.deleteMany({});

  // Criar empresa demo
  const company = await prisma.company.create({
    data: {
      name: 'HublaIA Demo - Imobiliária XYZ',
      slug: 'hublaia-demo',
      email: 'contato@hublaia-demo.com',
      billingEmail: 'billing@hublaia-demo.com',
      country: 'BR',
      state: 'SP',
      city: 'São Paulo',
    },
  });

  console.log('✅ Empresa criada:', company.name);

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      tenantId: company.id,
      email: 'admin@hublaia-demo.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Demo',
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Usuário admin criado:', adminUser.email);

  // Criar departamento
  const department = await prisma.department.create({
    data: {
      tenantId: company.id,
      name: 'Vendas de Imóveis',
      color: '#3B82F6',
    },
  });

  console.log('✅ Departamento criado:', department.name);

  // Criar fila
  const queue = await prisma.queue.create({
    data: {
      tenantId: company.id,
      name: 'Fila Principal',
      strategy: 'ROUND_ROBIN',
      departmentId: department.id,
    },
  });

  console.log('✅ Fila criada:', queue.name);

  // Criar agente
  const agent = await prisma.agent.create({
    data: {
      tenantId: company.id,
      userId: adminUser.id,
      name: 'Admin Demo',
      title: 'Gerente de Vendas',
      isAvailable: true,
      status: 'ONLINE',
      maxConcurrent: 10,
      departmentId: department.id,
      specialties: ['Vendas Residenciais', 'Vendas Comerciais'],
    },
  });

  console.log('✅ Agent criado:', agent.name);

  // Criar subscription
  const subscription = await prisma.subscription.create({
    data: {
      tenantId: company.id,
      plan: 'PROFESSIONAL',
      status: 'TRIAL',
      startDate: new Date(),
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      leadsLimit: 1000,
      agentsLimit: 10,
    },
  });

  console.log('✅ Subscription criada:', subscription.plan);

  // Criar alguns leads de teste
  const leads = [];
  for (let i = 1; i <= 5; i++) {
    const lead = await prisma.lead.create({
      data: {
        tenantId: company.id,
        name: `Cliente Potencial ${i}`,
        email: `cliente${i}@example.com`,
        phone: `11 9${Math.floor(Math.random() * 100000000)}`,
        source: 'WEBSITE',
        status: 'NEW',
        classification: ['RED', 'YELLOW', 'GREEN', 'BLUE', 'GRAY'][Math.floor(Math.random() * 5)] as any,
      },
    });
    leads.push(lead);
  }

  console.log(`✅ ${leads.length} leads criados para teste`);

  console.log('\n✨ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
