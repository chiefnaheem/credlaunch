import { Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from 'typeorm.config';
import { AuthModule } from './auth/auth.module';
import { HttpServiceModule } from './common/http/http.module';
import { SeedsModule } from './seeds/seed.module';
import { TransactionModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),

    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 5000,
          limit: 1,
        },
        {
          name: 'medium',
          ttl: 20000,
          limit: 25,
        },
        {
          name: 'long',
          ttl: 35000,
          limit: 50,
        },
      ],
    }),

    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),

    AuthModule,
    UserModule,
    WalletModule,
    HttpServiceModule,
    TransactionModule,
    SeedsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
