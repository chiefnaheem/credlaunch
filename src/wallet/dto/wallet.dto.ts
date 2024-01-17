import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrencyEnum } from '../enum/wallet.enum';

export class CreateWalletDto {
  @ApiProperty({
    description: 'The currency of the wallet',
    enum: CurrencyEnum,
    default: CurrencyEnum.NGN,
  })
  @IsEnum(CurrencyEnum)
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional({ description: 'The default status of the wallet' })
  @IsBoolean()
  @IsOptional()
  isDefault: boolean;
}

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class IntializeFundWalletDto {
  @ApiProperty({ description: 'The amount to fund the wallet' })
  @IsInt()
  @IsNotEmpty()
  amount: number;
}

export class VerifyTransactionDto {
  @ApiProperty({ description: 'The transaction reference' })
  @IsString()
  @IsNotEmpty()
  reference: string;
}
