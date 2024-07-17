import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LocalAuthGoard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGoard)
  @Post('signin')
  async signin(@Request() req: any) {
    return await this.authService.singin(req.user);
  }

  @Post('signup')
  async sungup(@Body() data: CreateUserDTO) {
    return await this.authService.signup(data);
  }
}
