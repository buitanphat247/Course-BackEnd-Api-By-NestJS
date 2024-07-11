import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request as RequestDecorator,
  Res,
  UseGuards,
} from '@nestjs/common';
import ms from 'ms';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from 'src/users/users.interface';

@Controller('auths')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async handleLogin(
    @RequestDecorator() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register new user')
  @Post('/register')
  async handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get infor account')
  @Get('/account')
  async getAccount(@User() user: UserInterface) {
    return await this.authService.getAccount(user._id);
  }

  @ResponseMessage('Get new token ')
  @Public()
  @Get('/refresh')
  async getNewToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.handleNewToken(request, response);
  }

  @ResponseMessage('Logout')
  @Post('/logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.handleLogout(request, response);
  }
}
