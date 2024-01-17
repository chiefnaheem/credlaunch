import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpServices } from 'src/common/http/http.service';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private readonly httpService: HttpServices,
    private readonly userService: UserService,
  ) {}

  async createWallet(wallet: Partial<Wallet>, user: string): Promise<Wallet> {
    try {
      wallet.accountNumber = Date.now().toString().slice(0, 10);
      this.logger.debug(`Creating wallet with data ${JSON.stringify(wallet)}`);

      const existingWallet = await this.walletRepository.findOne({
        where: {
          user,
          currency: wallet.currency,
        },
      });

      if (existingWallet) {
        throw new BadRequestException(
          'Wallet already exists for this currency',
        );
      }

      // const encyptedAccountNumber = encrypt(wallet.accountNumber);
      const newWallet = this.walletRepository.create({
        ...wallet,
        balance: 0,
        user,
      });

      return await this.walletRepository.save(newWallet);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateWallet(id: string, wallet: Partial<Wallet>): Promise<Wallet> {
    try {
      this.logger.debug(`Updating wallet with id ${id}`);
      const existingWallet = await this.walletRepository.findOne(id);

      if (!existingWallet) {
        throw new BadRequestException('Wallet does not exist');
      }

      const updatedWallet = this.walletRepository.merge(existingWallet, wallet);

      return await this.walletRepository.save(updatedWallet);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findWalletByUser(user: string): Promise<Wallet[]> {
    try {
      this.logger.debug(`Finding wallet with user ${user}`);
      const wallets = await this.walletRepository.find({
        where: {
          user,
        },
      });

      return wallets;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneWalletById(id: string): Promise<Wallet> {
    try {
      this.logger.debug(`Finding wallet with id ${id}`);
      const wallet = await this.walletRepository.findOne({
        where: {
          id,
        },
        relations: ['user'],
      });
      if (!wallet) {
        throw new BadRequestException('Wallet does not exist');
      }
      return wallet;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findWalletByAccountNumber(accountNumber: string): Promise<Wallet> {
    try {
      this.logger.debug(`Finding wallet with account number ${accountNumber}`);
      const wallet = await this.walletRepository.findOne({
        where: {
          accountNumber,
        },
        relations: ['user'],
      });
      if (!wallet) {
        throw new BadRequestException('Wallet does not exist');
      }
      return wallet;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateWalletByUserAndCurrency(
    user: string,
    currency: string,
    amount: number,
  ): Promise<Wallet> {
    try {
      this.logger.debug(`Finding wallet with user ${user}`);
      const wallet = await this.walletRepository.findOne({
        where: {
          user,
          currency,
        },
      });
      wallet.balance = wallet.balance + amount;

      return await this.walletRepository.save(wallet);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async intializeFundWallet(id: string, amount: number) {
    try {
      this.logger.debug(`Funding wallet with id ${id}`);
      const user = await this.userService.findUserById(id);
      const response = await this.httpService.request(
        'POST',
        `/transaction/initialize`,
        {
          amount,
          email: user.email,
        },
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async verifyTransaction(reference: string) {
    try {
      this.logger.debug(`Verifying transaction with reference ${reference}`);
      const response = await this.httpService.request(
        'GET',
        `/transaction/verify/${reference}`,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async deleteWallet(id: string): Promise<boolean> {
    try {
      this.logger.debug(`Deleting wallet with id ${id}`);
      const wallet = await this.walletRepository.findOne({
        where: {
          id,
        },
      });

      if (!wallet) {
        throw new BadRequestException('Wallet does not exist');
      }

      if (wallet.balance !== 0) {
        throw new BadRequestException(
          'Cannot delete wallet with non-zero balance',
        );
      }

      // Delete the wallet
      await this.walletRepository.delete(id);

      return true;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
