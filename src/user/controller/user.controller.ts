import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { IResponse } from 'src/common/interface/response.interface';
import { UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'User ID',
  })
  @Patch('update-user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IResponse> {
    try {
      const user = await this.userService.updateUser(id, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
