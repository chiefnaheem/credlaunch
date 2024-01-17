import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { IResponse } from 'src/common/interface/response.interface';
import { User } from 'src/user/entities/user.entity';
import { TransactionDto } from '../dto/transaction.dto';
import { TransactionEvent } from '../enum/transaction.enum';
import { TransferGuard } from '../gaurds/transaction.guard';
import { TransactionService } from '../services/transaction.service';

@ApiTags('Transaction')
@ApiBearerAuth('Bearer')
@Controller('transaction')
@UseGuards(AuthGuard())
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @ApiBody({ type: TransactionDto, required: true })
  @UseGuards(ThrottlerGuard, TransferGuard)
  @Post('transfer')
  async createTransaction(
    @Body() body: TransactionDto,
    @Req() req: Request,
  ): Promise<IResponse> {
    const user = req.user as User;
    let message: string;
    const transaction = await this.transactionService.createTransaction(
      body,
      user.id as unknown as string,
    );
    this.eventEmitter.emit(TransactionEvent.TRANSACTION_CREATED, transaction);

    transaction.amount > 1000000
      ? (message = 'Transaction created successfully, awaiting admin approval')
      : (message = 'Transaction created successfully');

    return {
      statusCode: 200,
      message,
      data: transaction,
    };
  }

  @Get('transactions-to-approve')
  @UseGuards(AdminGuard)
  async getTransactionsToApprove(): Promise<IResponse> {
    const transactions =
      await this.transactionService.getTransactionsToApprove();
    return {
      statusCode: 200,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }

  @Post('admin-approve-transaction/:id')
  @UseGuards(AdminGuard)
  async adminApproveTransaction(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<IResponse> {
    const transaction = await this.transactionService.adminApproveTransaction(
      id,
    );
    return {
      statusCode: 200,
      message: 'Transaction approved successfully',
      data: transaction,
    };
  }

  @Get('monthly-transactions')
  @UseGuards(AdminGuard)
  async getMonthlyTransactions(
    @Query('dateFilter') dateFilter: string,
  ): Promise<IResponse> {
    const transactions = await this.transactionService.getMonthlyTransactions(
      dateFilter,
    );
    return {
      statusCode: 200,
      message: 'Transactions fetched successfully',
      data: transactions,
    };
  }
}
