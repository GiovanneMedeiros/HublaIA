import { Module, MiddlewareConsumer } from '@nestjs/common';
import { InfrastructureModule } from '@shared/infrastructure/InfrastructureModule';
import { TenantMiddleware } from '@shared/infrastructure/middleware/TenantMiddleware';
import { AuthModule } from '@modules/auth/auth.module';
import { LeadModule } from '@modules/lead/lead.module';
import { AgentModule } from '@modules/agent/agent.module';
import { QueueModule } from '@modules/queue/queue.module';
import { WebhookModule } from '@modules/webhook/webhook.module';
import { OnboardingModule } from '@modules/onboarding/onboarding.module';

/**
 * Módulo raiz da aplicação
 */
@Module({
  imports: [
    InfrastructureModule,
    AuthModule,
    LeadModule,
    AgentModule,
    QueueModule,
    WebhookModule,
    OnboardingModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
