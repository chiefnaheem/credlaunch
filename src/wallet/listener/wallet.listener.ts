import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserService } from 'src/user/service/user.service';
import { WalletEvent } from '../enum/wallet.enum';
import { WalletService } from '../services/wallet.service';

@Injectable()
export class WalletListener {
  private logger = new Logger('Wallet Listener');
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  @OnEvent(WalletEvent.WALLET_FUNDED)
  async handleWalletFundedEvent(event: any): Promise<void> {
    try {
      const user = await this.userService.findUserByEmail(event.customer.email);
      const wallet = await this.walletService.updateWalletByUserAndCurrency(
        user.id,
        event.currency,
        event.amount / 100,
      );
      this.logger.debug(`Wallet updated ${JSON.stringify(wallet)}`);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
