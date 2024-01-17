import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HttpServices } from './http.service';

@Module({
  controllers: [],
  providers: [HttpServices],
  imports: [HttpModule],
  exports: [HttpModule, HttpServices],
})
export class HttpServiceModule {}
