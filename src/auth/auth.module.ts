import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import serverConfig from "src/database/config/env.config";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./controller/auth.controller";
import { AuthService } from "./service/auth.service";
import { TokenService } from "./service/token.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: serverConfig.JWT_SECRET,
      signOptions: {
        expiresIn: serverConfig.JWT_EXPIRES_IN,
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService],
  exports: [JwtStrategy, PassportModule, TokenService],
})
export class AuthModule {}
