import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { hashPassword } from 'src/common/functions/common';
import { UserRole } from 'src/user/enum/user.enum';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class SeedsService implements OnModuleInit {
  private readonly logger = new Logger(SeedsService.name);
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    try {
      this.logger.log('Seeding data...');
      const adminExists = await this.userService.findAdminExists();
      if (!adminExists) {
        await this.userService.createUser({
          email: 'naheemade@gmail.com',
          password: hashPassword('Test@123!nb%'),
          firstName: 'Admin',
          lastName: 'Naheem',
          role: UserRole.ADMIN,
          phoneNumber: '07065074553',
        });
      }
      this.logger.log('Seeding completed!');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
