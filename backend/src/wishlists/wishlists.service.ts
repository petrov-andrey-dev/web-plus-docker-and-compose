import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDTO } from './dto/create-wishlist.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDTO } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishService: WishesService,
  ) {}

  async getAllWishlists() {
    return this.wishlistsRepository.find();
  }

  async createWishlist(user: User, createWishlistDto: CreateWishlistDTO) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { itemsId, ...rest } = createWishlistDto;
    const wishes = await this.wishService.findWishes(createWishlistDto.itemsId);
    const wishlist = await this.wishlistsRepository.create({
      ...rest,
      owner: user,
      items: wishes,
    });
    return await this.wishlistsRepository.save(wishlist);
  }

  async getWishlist(id: number) {
    return await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: ['items', 'owner'],
    });
  }

  async updateWishlist(
    user: User,
    id: number,
    updateWishlistDto: UpdateWishlistDTO,
  ) {
    const wishlist = await this.getWishlist(id);
    if (wishlist.owner.id != user.id) {
      throw new UnauthorizedException(
        'Недостаточно прав на изменение вишлиста',
      );
    }
    if (updateWishlistDto.itemsId) {
      const { itemsId, ...rest } = updateWishlistDto;
      const wishes = await this.wishService.findWishes(itemsId);
      wishlist.items.push(...wishes);
      await this.wishlistsRepository.save(wishlist);
      await this.wishlistsRepository.update(id, rest);
    } else {
      await this.wishlistsRepository.update(id, updateWishlistDto);
    }
    return wishlist;
  }

  async deleteWishlist(user: User, id: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: id },
    });
    if (wishlist.owner.id != user.id) {
      throw new UnauthorizedException('Недостаточно прав на удаление вишлиста');
    }
    return await this.wishlistsRepository.delete(id);
  }
}
