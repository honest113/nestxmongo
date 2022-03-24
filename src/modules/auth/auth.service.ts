import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EEnvType } from 'src/constants/env.type';
import { EError } from 'src/constants/error-code.constant';
import { EUserRole, EUserStatus } from 'src/constants/schema.constant';
import { httpBadRequest, httpNotFound, httpUnauthorized } from 'src/share/exception/http-exception';
import { UsersService } from '../users/users.service';
import { LoginUserDto, SignUpUserBodyRequestDto } from './dtos/auth.dto';

import * as bcrypt from 'bcrypt';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService,
  ) {}

  private generateToken(userId: string, role: EUserRole) {
    const payload = { userId: userId, role: role };
    const token = this.tokenService.signJwt(payload);
    return token;
  }

  async hashPassword(password: string) {
    const saltRound = this.configService.get<number>(EEnvType.BCRYPT_SALT_ROUND);
    return await bcrypt.hash(password, saltRound);
  }

  async login(data: LoginUserDto) {
    const user = await this.usersService.getUserByAttribute(
      { email: data.email, deletedAt: null, status: EUserStatus.ACTIVE },
      { email: true, password: true, role: true },
    );
    if (!user) httpNotFound('User Not Found');

    if (!(await bcrypt.compare(data.password, user.password))) httpUnauthorized();

    const accessToken = this.generateToken(`${user._id}`, user.role);
    return accessToken;
  }

  async signup(data: SignUpUserBodyRequestDto) {
    const user = await this.usersService.getUserByAttribute({ email: data.email, deletedAt: null });
    if (user) httpBadRequest('Mail Exist', EError.E_101);

    const passwordHash = await this.hashPassword(data.password);
    const result = await this.usersService.createUser({
      email: data.email,
      password: passwordHash,
      fullName: data?.fullName,
    });

    return { id: result._id };
  }

  async test(token) {
    try {
      const check = this.tokenService.verifyJwt(token);
      console.log(check);
    } catch (err) {
      httpUnauthorized();
    }
  }
}
