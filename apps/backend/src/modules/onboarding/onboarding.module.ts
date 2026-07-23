import { Module } from '@nestjs/common';
import { OnboardingController } from './infrastructure/controllers/OnboardingController';
import { OnboardingService } from './application/services/OnboardingService';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
