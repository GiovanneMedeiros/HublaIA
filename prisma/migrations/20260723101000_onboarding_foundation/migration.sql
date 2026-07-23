-- Create onboarding and tenant setup foundation tables

CREATE TABLE "TenantOnboarding" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"tenantId" UUID NOT NULL,
	"currentStep" VARCHAR(40) NOT NULL DEFAULT 'company',
	"completedSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
	"isCompleted" BOOLEAN NOT NULL DEFAULT false,
	"completedAt" TIMESTAMP(0),
	"createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(0) NOT NULL,
	CONSTRAINT "TenantOnboarding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TenantBusinessProfile" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"tenantId" UUID NOT NULL,
	"segment" VARCHAR(40) NOT NULL DEFAULT 'OUTRO',
	"city" VARCHAR(120),
	"businessDescription" TEXT,
	"communicationStyle" VARCHAR(40),
	"importantInfo" TEXT,
	"propertyTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
	"serviceAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
	"specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
	"priceRange" VARCHAR(120),
	"workingHours" VARCHAR(120),
	"extraDescription" TEXT,
	"customData" JSONB NOT NULL DEFAULT '{}',
	"createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(0) NOT NULL,
	CONSTRAINT "TenantBusinessProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TenantAgentSetting" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"tenantId" UUID NOT NULL,
	"agentName" VARCHAR(120) NOT NULL DEFAULT 'Assistente HublaIA',
	"personality" VARCHAR(40) NOT NULL DEFAULT 'PROFISSIONAL',
	"language" VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
	"welcomeMessage" TEXT,
	"transferTriggers" TEXT[] DEFAULT ARRAY[]::TEXT[],
	"allowHumanRequest" BOOLEAN NOT NULL DEFAULT true,
	"classificationSettings" JSONB NOT NULL DEFAULT '{}',
	"createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(0) NOT NULL,
	CONSTRAINT "TenantAgentSetting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TenantRoutingRule" (
	"id" UUID NOT NULL DEFAULT gen_random_uuid(),
	"tenantId" UUID NOT NULL,
	"distributionMode" VARCHAR(40) NOT NULL DEFAULT 'AUTOMATIC',
	"prioritizeAvailable" BOOLEAN NOT NULL DEFAULT true,
	"teamAvailability" JSONB NOT NULL DEFAULT '[]',
	"queueOrder" JSONB NOT NULL DEFAULT '[]',
	"createdAt" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" TIMESTAMP(0) NOT NULL,
	CONSTRAINT "TenantRoutingRule_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TenantOnboarding_tenantId_key" ON "TenantOnboarding"("tenantId");
CREATE INDEX "TenantOnboarding_tenantId_idx" ON "TenantOnboarding"("tenantId");
CREATE INDEX "TenantOnboarding_isCompleted_idx" ON "TenantOnboarding"("isCompleted");

CREATE UNIQUE INDEX "TenantBusinessProfile_tenantId_key" ON "TenantBusinessProfile"("tenantId");
CREATE INDEX "TenantBusinessProfile_tenantId_idx" ON "TenantBusinessProfile"("tenantId");
CREATE INDEX "TenantBusinessProfile_segment_idx" ON "TenantBusinessProfile"("segment");

CREATE UNIQUE INDEX "TenantAgentSetting_tenantId_key" ON "TenantAgentSetting"("tenantId");
CREATE INDEX "TenantAgentSetting_tenantId_idx" ON "TenantAgentSetting"("tenantId");

CREATE UNIQUE INDEX "TenantRoutingRule_tenantId_key" ON "TenantRoutingRule"("tenantId");
CREATE INDEX "TenantRoutingRule_tenantId_idx" ON "TenantRoutingRule"("tenantId");

ALTER TABLE "TenantOnboarding"
	ADD CONSTRAINT "TenantOnboarding_tenantId_fkey"
	FOREIGN KEY ("tenantId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenantBusinessProfile"
	ADD CONSTRAINT "TenantBusinessProfile_tenantId_fkey"
	FOREIGN KEY ("tenantId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenantAgentSetting"
	ADD CONSTRAINT "TenantAgentSetting_tenantId_fkey"
	FOREIGN KEY ("tenantId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenantRoutingRule"
	ADD CONSTRAINT "TenantRoutingRule_tenantId_fkey"
	FOREIGN KEY ("tenantId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
