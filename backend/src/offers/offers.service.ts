import { WishesService } from './../wishes/wishes.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.getWish(createOfferDto.itemId);
    if (wish.price < Number(wish.raised) + createOfferDto.amount) {
      throw new BadRequestException(
        'Сумма средств не может превышать стоимости подарка',
      );
    }
    if (wish.owner.id === user.id) {
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }
    await this.wishesService.updateWish(user, createOfferDto.itemId, {
      raised: Number(wish.raised) + createOfferDto.amount,
    });
    return await this.offerRepository.save({
      ...createOfferDto,
      user,
      item: wish,
    });
  }

  async getAllOffers() {
    return await this.offerRepository.find();
  }

  async getOffer(id: number) {
    return await this.offerRepository.findOne({
      where: { id: id },
    });
  }
}
