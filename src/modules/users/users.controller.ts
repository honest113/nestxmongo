import { Body, Controller, Delete, Put, Request } from '@nestjs/common';
import { IJwtPayload } from 'src/share/interface/auth.interface';
import { UpdateUserRequestDto } from './dtos/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  updateUser(@Request() request, @Body() body: UpdateUserRequestDto) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.usersService.updateUser(userId, body);
  }

  @Delete()
  deleteUser(@Request() request) {
    const userId = (request.user as IJwtPayload)?.userId;
    return this.usersService.deleteUser(userId);
  }
}
