import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto, SignUpUserBodyRequestDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  test(@Request() request: Request) {
    const bearerToken = (request.headers as any).authorization.split(' ')[1];
    console.log(bearerToken);
    return this.authService.test(bearerToken);
  }

  @Post('sign-up')
  signUp(@Body() body: SignUpUserBodyRequestDto) {
    return this.authService.signup(body);
  }

  @Post('log-in')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
