import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { generateRandomAlphanumeric } from 'src/common/functions/common';
import { UserService } from 'src/user/service/user.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WalletService } from 'src/wallet/services/wallet.service';
import { TransactionEvent, TransactionStatus } from '../enum/transaction.enum';
import { TransactionService } from '../services/transaction.service';

@Injectable()
export class TransactionListener {
  private logger = new Logger('Transaction Listener');
  constructor(
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  @OnEvent(TransactionEvent.TRANSACTION_CREATED)
  async handleTransactionCreatedEvent(event: any): Promise<void> {
    try {
      this.logger.debug(`Transaction created ${JSON.stringify(event)}`);
      const [senderWalletDetails, receiverWalletDetails] = await Promise.all([
        this.walletService.findOneWalletById(event.senderWallet),
        this.walletService.findOneWalletById(event.receiverWallet),
      ]);

      if (event.amount > 1000000) {
        await this.handleLargeAmountTransaction(event, senderWalletDetails);
        return;
      }

      await this.processRegularTransaction(
        event,
        senderWalletDetails,
        receiverWalletDetails,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  private async fetchWalletDetails(walletId: string): Promise<Wallet> {
    return this.walletService.findOneWalletById(walletId);
  }

  private async handleLargeAmountTransaction(
    event: any,
    senderWalletDetails: Wallet,
  ): Promise<void> {
    await this.transactionService.updateTransaction(event.id, {
      status: TransactionStatus.REQUIRES_ACTION,
    });

    await this.walletService.updateWallet(event.senderWallet, {
      balance: senderWalletDetails.balance - event.amount,
      isLocked: false,
    });
  }

  private async processRegularTransaction(
    event: any,
    senderWalletDetails: Wallet,
    receiverWalletDetails: Wallet,
  ): Promise<void> {
    const reference = generateRandomAlphanumeric(10);

    await this.updateWalletsAndTransactions(
      event,
      senderWalletDetails,
      receiverWalletDetails,
      reference,
    );

    this.logger.debug(`Transaction updated ${JSON.stringify(event)}`);
  }

  private async updateWalletsAndTransactions(
    event: any,
    senderWalletDetails: Wallet,
    receiverWalletDetails: Wallet,
    reference: string,
  ): Promise<void> {
    await this.walletService.updateWallet(event.senderWallet, {
      balance: senderWalletDetails.balance - event.amount,
      isLocked: false,
    });

    await this.walletService.updateWallet(event.receiverWallet, {
      balance: receiverWalletDetails.balance + event.amount,
    });

    await this.transactionService.updateTransaction(event.id, {
      status: TransactionStatus.SUCCESSFUL,
      reference,
    });
  }

  @OnEvent(TransactionEvent.TRANSACTION_FAILED)
  async handleTransactionFailedEvent(event: any): Promise<void> {
    try {
      this.logger.debug(`Transaction created ${JSON.stringify(event)}`);
      await this.transactionService.refundTransaction(event.id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
