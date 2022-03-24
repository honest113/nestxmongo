import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserRequestDto) {
    return this.usersService.createUser(body);
  }
}
