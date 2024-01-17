import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { classToPlain, instanceToPlain } from 'class-transformer';
import {
  comparePassword,
  hashPassword,
  unifyPhoneNumber,
} from 'src/common/functions/common';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/user/enum/user.enum';
import { UserService } from 'src/user/service/user.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { JwtPayload } from '../strategies/jwt.strategy';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async findUserByPhoneOrEmail(phone: string, email: string) {
    return await this.userService.findUserByPhoneOrEmail(phone, email);
  }

  async findUserByPhone(phone: string): Promise<User> {
    return await this.userService.findUserByPhone(phone);
  }

  async validateUser(phoneNumber: string, password: string) {
    const user = await this.findUserByPhone(phoneNumber);
    if (user && comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(
    user: LoginDto,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    try {
      const { phoneNumber, password } = user;
      const unifiedPhoneNumber = unifyPhoneNumber(phoneNumber);
      const userExists = await this.validateUser(unifiedPhoneNumber, password);
      if (!userExists) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = {
        phoneNumber: userExists.phoneNumber,
        id: userExists.id,
        role: userExists.role,
      };

      const accessToken = await this.tokenService.tokenize({ data: payload });
      this.logger.debug(
        `Generated JWT Token with payload ${JSON.stringify(payload)}`,
      );

      return { accessToken, user: instanceToPlain(userExists) };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async register(user: RegisterDto): Promise<Partial<User>> {
    try {
      const { phoneNumber, password, email } = user;
      const unifiedPhoneNumber = unifyPhoneNumber(phoneNumber);
      const userExists = await this.findUserByPhoneOrEmail(unifiedPhoneNumber, email);
      if (userExists) {
        throw new ConflictException('User already exists');
      }

      const hashedPassword = hashPassword(password);
      const newUser = await this.userService.createUser({
        ...user,
        password: hashedPassword,
        role: UserRole.USER,
        phoneNumber: unifiedPhoneNumber,
      });
      return instanceToPlain(newUser);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
