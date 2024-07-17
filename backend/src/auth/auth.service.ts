import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HasingHalper } from 'src/common/helpers/hashing.helper';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && (await HasingHalper.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async singin(user: any) {
    const { username, id } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, id }),
    };
  }

  async signup(data: CreateUserDTO) {
    return await this.userService.createUser(data);
  }
}
