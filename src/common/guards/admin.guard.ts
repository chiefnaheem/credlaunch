import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/user/enum/user.enum';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(' admin Guard');
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const adminExists = await this.userService.findAdminExists();
      if (adminExists && user.role === UserRole.ADMIN) {
        return true;
      }
      // return false;
      throw new UnauthorizedException(
        'You are not authorized to perform this activity',
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
