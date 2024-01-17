import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPassportNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
  Min,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'The phone number of the user' })
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserTokenDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class RegisterDto {
  @ApiProperty({ description: 'The phone number of the user' })
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).{6,}$/, {
    message: 'Password must contain at least 1 letter and 1 number',
  })
  password: string;

  @ApiPropertyOptional({ description: 'The email of the user' })
  @IsOptional()
  @IsString()
  dateOfBirth: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
