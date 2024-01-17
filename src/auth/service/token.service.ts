import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import serverConfig from 'src/database/config/env.config';
import { UserTokenDto } from '../dto/auth.dto';

@Injectable()
export class TokenService {
  private expiresIn: string;
  private tokenSecret: string;
  private refreshTokenExpiration: string;
  constructor() {
    this.expiresIn = serverConfig.JWT_EXPIRES_IN;
    this.tokenSecret = serverConfig.JWT_SECRET;
  }

  tokenize({
    data,
    expiresIn = this.expiresIn,
  }: {
    data: UserTokenDto,
    expiresIn?: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(data, this.tokenSecret, { expiresIn }, (err, decoded) => {
        if (err) reject(new InternalServerErrorException(err));
        resolve(decoded);
      });
    });
  }

  verifyExpiredToken(token: string) {
    return new Promise((resolve, reject) => {
      const tokenSecret = serverConfig.JWT_SECRET;
      jwt.verify(
        token,
        tokenSecret,
        { ignoreExpiration: true },
        (err, decoded) => {
          if (err) reject(new UnauthorizedException(err.message));
          resolve(decoded);
        },
      );
    });
  }

  verifyUserToken(token: string): Promise<UserTokenDto> {
    return new Promise((resolve) => {
      const tokenSecret = serverConfig.JWT_SECRET;
      jwt.verify(token, tokenSecret, (err, decoded: UserTokenDto) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new HttpException(
              {
                status: '451',
                message: 'token expired',
              },
              451,
            );
          }
          throw new BadRequestException(err.message);
        }
        resolve(decoded);
      });
    });
  }

  decode(token: string) {
    return jwt.decode(token, { complete: true });
  }
}
