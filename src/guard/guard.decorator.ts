import { SetMetadata } from '@nestjs/common';
import { EGuardDecoratorKey } from 'src/constants/guard.constant';

export const GuardPublic = () => SetMetadata(EGuardDecoratorKey.IS_PUBLIC_KEY, true);
