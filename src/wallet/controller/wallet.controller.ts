import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { IResponse } from 'src/common/interface/response.interface';
import { User } from 'src/user/entities/user.entity';

import {
  CreateWalletDto,
  IntializeFundWalletDto,
  VerifyTransactionDto,
} from '../dto/wallet.dto';
import { WalletService } from '../services/wallet.service';
import { WalletEvent } from '../enum/wallet.enum';

@ApiTags('Wallet')
@ApiBearerAuth('Bearer')
@Controller('wallet')
@UseGuards(AuthGuard())
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('create-wallet')
  async createWallet(
    @Body() body: CreateWalletDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    const user = req.user as User;
    const wallet = await this.walletService.createWallet(
      body,
      user.id as unknown as string,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Wallet created successfully',
      data: wallet,
    };
  }


  @Get('find-wallet/:id')
  async findWallet(@Param('id', ParseUUIDPipe) id: string): Promise<IResponse> {
    const wallet = await this.walletService.findOneWalletById(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Wallet fetched successfully',
      data: wallet,
    };
  }

  @Get('find-wallets')
  async findWallets(@Req() req: Request): Promise<IResponse> {
    const user = req.user as User;
    const wallets = await this.walletService.findWalletByUser(
      user.id as unknown as string,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Wallets fetched successfully',
      data: wallets,
    };
  }

  @Post('intialize-fund-wallet')
  async intializeFundWallet(
    @Body() body: IntializeFundWalletDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    const user = req.user as User;
    const res = await this.walletService.intializeFundWallet(
      user.id as unknown as string,
      body.amount,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Wallet funded successfully',
      data: res,
    };
  }

  @Post('fund-wallet')
  async verifyTransaction(
    @Body() body: VerifyTransactionDto,
  ): Promise<IResponse> {
    const res = await this.walletService.verifyTransaction(body.reference) as any;
    if (res.status === true && res.data.status === 'success') {
      this.eventEmitter.emit(WalletEvent.WALLET_FUNDED, res.data);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Transaction verified successfully',
      data: res,
    };
  }
}
