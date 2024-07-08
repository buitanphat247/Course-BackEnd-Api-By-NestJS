import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserInterface } from 'src/users/users.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.checkPassword(pass, user.password);
      if (isValid === true) return user;
    }
    return null;
  }
  async login(user: UserInterface) {
    const { _id, name, email, role } = user;
    const payload = {
      _id,
      name,
      email,
      role,
      sub: 'token login',
      iss: 'from sever',
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role,
    };
  }


  
}
