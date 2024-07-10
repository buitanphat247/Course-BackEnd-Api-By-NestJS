import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage('Register new user')
  @Post('/register')
  async handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }
}
