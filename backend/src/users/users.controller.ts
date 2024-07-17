import { AuthUser } from 'src/common/decorators/user.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGoard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@UseGuards(JwtAuthGoard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(@AuthUser() user: User) {
    return await this.usersService.findById(user.id);
  }

  @Patch('me')
  async patchMe(@AuthUser() user: User, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.usersService.updateUser(user, updateUserDTO);
  }

  @Get('me/wishes')
  async getMeWishes(@AuthUser() user: User) {
    return await this.usersService.getWishes(user.username);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string) {
    return await this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    return await this.usersService.getWishes(username);
  }

  @Post('find')
  async findMany(@Body() data: { query: string }) {
    return this.usersService.findMany(data.query);
  }
}
