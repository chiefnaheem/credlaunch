import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { isPhoneNumber } from 'src/common/functions/common';
import { IResponse } from 'src/common/interface/response.interface';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginDto, required: true })
  @Post('login')
  async login(@Body() data: LoginDto): Promise<IResponse> {
    try {
      const response = await this.authService.login(data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Login successful',
        data: response,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @ApiBody({ type: RegisterDto, required: true })
  @Post('register')
  async register(@Body() data: RegisterDto): Promise<IResponse> {
    try {
      const checkPhoneNumber = isPhoneNumber(data.phoneNumber);

      if (!checkPhoneNumber) {
        throw new BadRequestException('Invalid phone number');
      }

      const response = await this.authService.register(data);
      return {
        statusCode: HttpStatus.OK,
        message: 'Registration successful',
        data: response,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
