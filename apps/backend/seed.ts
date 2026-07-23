import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

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

  const department = await prisma.department.create({
    data: {
      tenantId: company.id,
      name: 'Vendas de Imóveis',
      color: '#3B82F6',
    },
  });

  console.log('✅ Departamento criado:', department.name);

  const queue = await prisma.queue.create({
    data: {
      tenantId: company.id,
      name: 'Fila Principal',
      strategy: 'ROUND_ROBIN',
      departmentId: department.id,
    },
  });

  console.log('✅ Fila criada:', queue.name);

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
