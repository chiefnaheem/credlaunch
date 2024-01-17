import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import serverConfig from 'src/database/config/env.config';
import { AuthService } from '../service/auth.service';
import { User } from 'src/user/entities/user.entity';

export interface JwtPayload {
    phoneNumber: string;
    id: string;
    role: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: serverConfig.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { phoneNumber } = payload;

    const user = await this.authService.findUserByPhone(phoneNumber)


    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }
}
