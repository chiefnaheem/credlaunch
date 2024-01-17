import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Response } from 'express';
import { UserTokenDto } from 'src/auth/dto/auth.dto';

export const UseToken = () => SetMetadata('token', true);

export const UserTokenDecorator = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const response: Response = ctx.switchToHttp().getResponse();
  return response.locals.tokenData as UserTokenDto;
});
