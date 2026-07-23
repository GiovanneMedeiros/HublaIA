/**
 * Public Decorator - Marca rotas que não precisam de autenticação
 */

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
