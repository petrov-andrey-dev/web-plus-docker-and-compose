import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGoard } from 'src/auth/guards/jwt-auth.guard';
import { WishlistsService } from './wishlists.service';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { UpdateWishlistDTO } from './dto/update-wishlist.dto';

@UseGuards(JwtAuthGoard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async getWishlists() {
    return await this.wishlistsService.getAllWishlists();
  }

  @Post()
  async createWishlist(
    @AuthUser() user: User,
    @Body() createWishlistDto: CreateWishlistDTO,
  ) {
    return await this.wishlistsService.createWishlist(user, createWishlistDto);
  }

  @Get(':id')
  async getWishlist(@Param('id') id: number) {
    return await this.wishlistsService.getWishlist(id);
  }

  @Patch(':id')
  async updateWishlist(
    @AuthUser() user: User,
    @Param('id') id: number,
    updateWishlistDto: UpdateWishlistDTO,
  ) {
    return await this.wishlistsService.updateWishlist(
      user,
      id,
      updateWishlistDto,
    );
  }

  @Delete(':id')
  async deleteWishlist(@AuthUser() user: User, @Param('id') id: number) {
    return await this.wishlistsService.deleteWishlist(user, id);
  }
}
