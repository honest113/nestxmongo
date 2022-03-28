import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from 'src/share/interface/auth.interface';
import { UpdateUserRequestDto, UserResponseDto } from './dtos/users.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  @ApiBearerAuth()
  updateUser(@Request() request, @Body() body: UpdateUserRequestDto) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.usersService.updateUser(userId, body);
  }

  @Delete()
  @ApiBearerAuth()
  deleteUser(@Request() request) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.usersService.deleteUser(userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserResponseDto })
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(@Request() request) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.usersService.getUser(userId);
  }
}
