import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { WalletService } from 'src/wallet/services/wallet.service';

@Injectable()
export class TransferGuard implements CanActivate {
  private readonly logger = new Logger('Wallet Guard');
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { senderWallet } = request.body;

      const wallet: any = await this.walletService.findOneWalletById(
        senderWallet,
      );

      if (!wallet) {
        throw new NotFoundException('Wallet not found');
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
