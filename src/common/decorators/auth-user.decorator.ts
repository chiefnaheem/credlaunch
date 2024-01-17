import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const AuthUser = createParamDecorator((data, request): User => request.user);
