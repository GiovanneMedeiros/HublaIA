/**
 * Integration Service - OpenAI Lead Qualification
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@config/config.service';
import { LoggerService } from './LoggerService';

export interface LeadQualificationResult {
  qualificationScore: number; // 0-100
  classification: 'RED' | 'YELLOW' | 'GREEN' | 'BLUE' | 'GRAY';
  sentiment: 'VERY_NEGATIVE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'VERY_POSITIVE';
  intent: string;
  summary: string;
  keywords: string[];
  entities: string[];
}

@Injectable()
export class OpenAIService {
  constructor(
    private configService: ConfigService,
    private logger: LoggerService
  ) {}

  async qualifyLead(leadData: {
    name: string;
    email?: string;
    phone: string;
    messages: string[];
    customFields?: Record<string, any>;
  }): Promise<LeadQualificationResult> {
    try {
      const apiKey = this.configService.openaiApiKey;
      if (!apiKey) {
        throw new Error('OpenAI API key não configurada');
      }

      // Mantemos a montagem do prompt para facilitar a integração real da API.
      void this.buildQualificationPrompt(leadData);

      // TODO: Integrar com OpenAI API
      // const response = await axios.post('https://api.openai.com/v1/chat/completions', {...})

      // Por enquanto, retornar resultado dummy
      return {
        qualificationScore: 75,
        classification: 'GREEN',
        sentiment: 'POSITIVE',
        intent: 'Purchase',
        summary: `Lead potencial de ${leadData.name}`,
        keywords: ['interested', 'purchase', 'quality'],
        entities: [leadData.email || '', leadData.phone],
      };
    } catch (error) {
      this.logger.error('Erro na qualificação de lead via OpenAI', error.message);

      // Retornar qualificação padrão em caso de erro
      return {
        qualificationScore: 0,
        classification: 'GRAY',
        sentiment: 'NEUTRAL',
        intent: 'Unknown',
        summary: 'Qualificação não disponível',
        keywords: [],
        entities: [],
      };
    }
  }

  private buildQualificationPrompt(leadData: any): string {
    const messagesText = leadData.messages.join('\n');

    return `
Analise os dados deste lead e forneça:
1. Score de qualificação (0-100)
2. Classificação (RED/YELLOW/GREEN/BLUE/GRAY)
3. Sentimento (VERY_NEGATIVE/NEGATIVE/NEUTRAL/POSITIVE/VERY_POSITIVE)
4. Intenção do lead
5. Resumo em uma frase
6. Palavras-chave extraídas
7. Entidades identificadas

Lead:
Nome: ${leadData.name}
Email: ${leadData.email || 'N/A'}
Telefone: ${leadData.phone}

Mensagens:
${messagesText}

Responda em JSON válido com as seguintes chaves: score, classification, sentiment, intent, summary, keywords, entities
`;
  }
}
