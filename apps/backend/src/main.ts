import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpStatus } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@shared/infrastructure/filters/AllExceptionsFilter';
import { ConfigService } from '@config/config.service';
import { LoggerService } from '@shared/infrastructure/services/LoggerService';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const loggerService = app.get(LoggerService);
  const httpAdapter = app.getHttpAdapter().getInstance();

  const renderHomePage = () => `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HublaIA Backend</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b1020;
      --panel: rgba(15, 23, 42, 0.9);
      --border: rgba(148, 163, 184, 0.18);
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-2: #22c55e;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 35%),
        radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.16), transparent 30%),
        linear-gradient(180deg, #0f172a 0%, #020617 100%);
      color: var(--text);
      padding: 24px;
    }

    main {
      width: min(720px, 100%);
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 24px 80px rgba(2, 6, 23, 0.45);
      backdrop-filter: blur(18px);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: #7dd3fc;
      font-size: 14px;
      font-weight: 600;
    }

    h1 {
      margin: 18px 0 12px;
      font-size: clamp(32px, 5vw, 54px);
      line-height: 1;
      letter-spacing: -0.04em;
    }

    p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
      font-size: 16px;
    }

    .grid {
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin-top: 28px;
    }

    .card {
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 16px;
      background: rgba(15, 23, 42, 0.65);
    }

    .card span {
      display: block;
      font-size: 13px;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .card strong {
      font-size: 15px;
    }

    a {
      color: var(--accent);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .status {
      margin-top: 28px;
      padding-top: 18px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      color: var(--muted);
      font-size: 14px;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--accent-2);
      box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.12);
      display: inline-block;
      margin-right: 8px;
    }
  </style>
</head>
<body>
  <main>
    <div class="badge">HublaIA Backend</div>
    <h1>Servidor pronto para uso.</h1>
    <p>
      A API NestJS está ativa e pronta para receber requisições. As rotas principais
      ficam sob <a href="/api">/api</a> e o monitoramento de saúde está em <a href="/health">/health</a>.
    </p>

    <section class="grid" aria-label="Links úteis">
      <div class="card">
        <span>API base</span>
        <strong><a href="/api">/api</a></strong>
      </div>
      <div class="card">
        <span>Health check</span>
        <strong><a href="/health">/health</a></strong>
      </div>
      <div class="card">
        <span>Frontend</span>
        <strong>http://localhost:3000</strong>
      </div>
    </section>

    <div class="status">
      <div><span class="dot"></span>Backend online</div>
      <div>HublaIA • local development</div>
    </div>
  </main>
</body>
</html>`;

  // CORS
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : [configService.frontendUrl];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  httpAdapter.get('/', (_req: any, res: any) => {
    res.status(200).type('html').send(renderHomePage());
  });

  httpAdapter.get('/health', (_req: any, res: any) => {
    res.status(200).json({
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    })
  );

  // Filtro de exceções global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Prefix de rotas
  app.setGlobalPrefix('api');

  const port = configService.port;
  await app.listen(port);

  loggerService.log(
    `🚀 HublaIA Backend iniciado com sucesso em http://localhost:${port}`,
    'NestApplication'
  );
  loggerService.log(`📊 Documentação em http://localhost:${port}/api/docs`, 'NestApplication');
}

bootstrap().catch((err) => {
  console.error('Erro ao iniciar aplicação:', err);
  process.exit(1);
});
