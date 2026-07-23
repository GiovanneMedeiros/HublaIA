/**
 * Enums compartilhados entre módulos
 */

export enum UserRole {
  ADMIN = 'ADMIN',
  SECRETARY = 'SECRETARY',
  AGENT = 'AGENT',
  VIEWER = 'VIEWER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum LeadStatus {
  NEW = 'NEW',
  IN_QUEUE = 'IN_QUEUE',
  WITH_AGENT = 'WITH_AGENT',
  TRANSFERRED = 'TRANSFERRED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum LeadClassification {
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  BLUE = 'BLUE',
  GRAY = 'GRAY',
}

export enum SentimentType {
  VERY_NEGATIVE = 'VERY_NEGATIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
  POSITIVE = 'POSITIVE',
  VERY_POSITIVE = 'VERY_POSITIVE',
}

export enum AgentStatus {
  ONLINE = 'ONLINE',
  AWAY = 'AWAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum QueueStrategy {
  ROUND_ROBIN = 'ROUND_ROBIN',
  FIXED_ORDER = 'FIXED_ORDER',
  SPECIALTY = 'SPECIALTY',
  DEPARTMENT = 'DEPARTMENT',
  AVAILABILITY = 'AVAILABILITY',
  PRIORITY = 'PRIORITY',
}

export enum PlanType {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIAL = 'TRIAL',
  PAUSED = 'PAUSED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export enum IntegrationType {
  WHATSAPP = 'WHATSAPP',
  OPENAI = 'OPENAI',
  GOOGLE_CALENDAR = 'GOOGLE_CALENDAR',
  SMTP = 'SMTP',
  WEBHOOK = 'WEBHOOK',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
}
