import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { SeedsService } from './seed.service';

@Module({
  imports: [UserModule],
  providers: [SeedsService],
})
export class SeedsModule {}
