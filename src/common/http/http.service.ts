import { HttpService as NestHttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import serverConfig from 'src/database/config/env.config';

@Injectable()
export class HttpServices {
  private readonly logger = new Logger(HttpServices.name);
  constructor(private readonly httpService: NestHttpService) {}

  async request<T>(method: string, url: string, data?: any): Promise<T> {
    try {
      const response = await this.httpService
        .request({
          url,
          method,
          data,
          baseURL: serverConfig.PAYSTACK_URL,
          headers: {
            Authorization: `Bearer ${serverConfig.PAYSTACK_SECRET_KEY}`,
          },
        })
        .toPromise();
      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
