import { Body, Controller, Post } from '@nestjs/common';
import { GuardPublic } from 'src/guard/guard.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto, SignUpUserBodyRequestDto } from './dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @GuardPublic()
  signUp(@Body() body: SignUpUserBodyRequestDto) {
    return this.authService.signup(body);
  }

  @Post('log-in')
  @GuardPublic()
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }
}
