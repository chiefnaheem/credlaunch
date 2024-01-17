import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unifyPhoneNumber } from 'src/common/functions/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    try {
      this.logger.debug(`Creating user with data ${JSON.stringify(user)}`);
      const phoneNumberUnified = unifyPhoneNumber(user.phoneNumber);
      const newUser = this.userRepository.create({
        ...user,
        phoneNumber: phoneNumberUnified,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAdminExists(): Promise<boolean> {
    try {
      this.logger.debug(`Checking if admin exists`);
      const admin = await this.userRepository.findOne({
        where: {
          role: 'ADMIN',
        },
      });
      return !!admin;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUserByPhoneOrEmail(phoneNumber: string, email: string): Promise<User> {
    try {
      this.logger.debug(
        `Finding user with phone number ${phoneNumber} or email ${email}`,
      );
      const user = await this.userRepository.findOne({
        where: [
          {
            phoneNumber,
          },
          {
            email,
          },
        ],
      });
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUserByPhone(phoneNumber: string): Promise<User> {
    try {
      this.logger.debug(`Finding user with phone number ${phoneNumber}`);
      const user = await this.userRepository.findOne({
        where: {
          phoneNumber,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      this.logger.debug(`Finding user with id ${id}`);
      const user = await this.userRepository.findOne(id);
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      this.logger.debug(`Finding user with email ${email}`);
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      this.logger.debug(`Updating user with id ${id}`);
      Object.assign(user, { id });
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
