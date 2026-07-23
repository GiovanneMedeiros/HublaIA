import { SetMetadata } from '@nestjs/common';

export const REQUIRED_MODULE_KEY = 'required_module_key';

export const RequireModule = (moduleKey: string) => SetMetadata(REQUIRED_MODULE_KEY, moduleKey);
