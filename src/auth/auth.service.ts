import { Injectable } from '@nestjs/common';

import ms from 'ms';

import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/users/users.interface';

import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.checkPassword(pass, user.password);
      if (isValid === true) return user;
    }
    return null;
  }
  async login(user: UserInterface, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      _id,
      name,
      email,
      role,
      sub: 'token login',
      iss: 'from sever',
    };
    const refresh_token = await this.refresh_token(user);
    await this.usersService.updateRefreshToken(refresh_token, _id);
    response.cookie('refresh_token', refresh_token, {
      sameSite: 'strict',
      httpOnly: true,
      maxAge:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) * 1000,
      secure: true,
    });
    return {
      message: 'Login success',
      result: {
        access_token: this.jwtService.sign(payload),
        refresh_token,
        _id,
        name,
        email,
        role,
      },
    };
  }
  async refresh_token(user: any) {
    const { _id, email, name, role } = user;
    const payload = {
      _id,
      email,
      name,
      role,
      sub: 'token refresh',
      iss: 'from sever',
    };
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) / 1000,
    });
    return refresh_token;
  }
  async register(registerUserDto: RegisterUserDto) {
    return await this.usersService.register(registerUserDto);
  }

  async getAccount(id: string) {
    const result_infor_account = await this.usersService.getUserById(id);
    return {
      message: result_infor_account.message,
      result: {
        user: {
          _id: result_infor_account.result._id,
          name: result_infor_account.result.name,
          email: result_infor_account.result.email,
          role: result_infor_account.result.role,
        },
      },
    };
  }

  async handleNewToken(request: Request, response: Response) {
    const refresh_token = request.cookies['refresh_token'];
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });
      const user = await this.usersService.geUserByToken(refresh_token);
      if (user) {
        const { _id, name, email, role } = user;
        const payload = {
          _id,
          name,
          email,
          role,
          sub: 'token login',
          iss: 'from sever',
        };
        const refresh_token = await this.refresh_token(user);
        await this.usersService.updateRefreshToken(
          refresh_token,
          _id.toString(),
        );
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refresh_token, {
          sameSite: 'strict',
          httpOnly: true,
          maxAge:
            ms(this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE')) *
            1000,
          secure: true,
        });
        return {
          message: 'Get new token is success',
          result: {
            access_token: this.jwtService.sign(payload),
            refresh_token,
            _id,
            name,
            email,
            role,
          },
        };
      }
    } catch (err) {
      throw new Error('Refresh token is invalid. Please login again.');
    }
  }

  async handleLogout(request: Request, response: Response) {
    const refresh_token = request.cookies['refresh_token'];
    const result_logout = await this.usersService.updateUserByToken(
      refresh_token,
      {
        refreshToken: null,
      },
    );
    response.clearCookie('refresh_token');
    return {
      message: 'Logout success',
      result: result_logout,
    };
  }
}
