import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/user/enum/user.enum';
import { UserService } from 'src/user/service/user.service';
import { WalletService } from '../services/wallet.service';

@Injectable()
export class WalletGuard implements CanActivate {
  private readonly logger = new Logger('Wallet Guard');
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { id } = request.params;

      const adminExists = await this.userService.findAdminExists();
      const wallet: any = await this.walletService.findOneWalletById(id);

      console.log(wallet, 'wallet');
      console.log(user, 'user');
      if (!wallet) {
        throw new NotFoundException('Wallet not found');
      }

      if (adminExists && user.role === UserRole.ADMIN) {
        return true;
      }

      if (wallet.user.id === user.id) {
        return true;
      }
      throw new UnauthorizedException(
        'You are not authorized to perform this activity',
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
