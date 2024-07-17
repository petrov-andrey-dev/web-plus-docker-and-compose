import { CreateWishDTO } from './dto/create-wish.dto';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { JwtAuthGoard } from 'src/auth/guards/jwt-auth.guard';
import { WishesService } from './wishes.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDTO } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGoard)
  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDTO: CreateWishDTO,
  ) {
    return await this.wishesService.createWish(user, createWishDTO);
  }

  @Get('last')
  async getLast() {
    return await this.wishesService.getLast();
  }

  @Get('top')
  async getTop() {
    return await this.wishesService.getTop();
  }

  @Get(':id')
  async getWish(@Param('id') id: number) {
    return await this.wishesService.getWish(id);
  }

  @UseGuards(JwtAuthGoard)
  @Patch(':id')
  async updateWish(
    @AuthUser() user: User,
    @Param('id') id: number,
    updateWishDto: UpdateWishDTO,
  ) {
    return await this.wishesService.updateWish(user, id, updateWishDto);
  }

  @UseGuards(JwtAuthGoard)
  @Delete(':id')
  async deleteWish(@AuthUser() user: User, @Param('id') id: number) {
    return await this.wishesService.deleteWish(user, id);
  }

  @UseGuards(JwtAuthGoard)
  @Post(':id/copy')
  async copyWish(@AuthUser() user: User, @Param('id') id: number) {
    return await this.wishesService.copyWish(user, id);
  }
}
