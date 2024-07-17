import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, In } from 'typeorm';
import { CreateWishDTO } from './dto/create-wish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDTO } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWish(user: User, data: CreateWishDTO): Promise<Wish> {
    const wish = await this.wishRepository.create({
      owner: user,
      ...data,
    });
    return await this.wishRepository.save(wish);
  }

  async getLast() {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner'],
    });
  }

  async getTop() {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
      relations: ['owner'],
    });
  }

  async getWish(id: number) {
    return await this.wishRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
  }

  async findWishes(ids: number[]) {
    return await this.wishRepository.find({ where: { id: In(ids) } });
  }

  async updateWish(user: User, id: number, updateWishDto: UpdateWishDTO) {
    const wish = await this.wishRepository.findOne({ where: { id: id } });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id != wish.owner.id) {
      throw new UnauthorizedException('Недостаточно прав');
    }
    await this.wishRepository.update(id, updateWishDto);
    return await this.wishRepository.findOne({ where: { id: id } });
  }

  async deleteWish(user: User, id: number) {
    const wish = await this.getWish(id);
    if (wish.owner.id === user.id) {
      return this.wishRepository.delete(id);
    } else {
      throw new UnauthorizedException('Недостаточно прав');
    }
  }

  async copyWish(user: User, wishId: number) {
    const wish = await this.getWish(wishId);
    if (wish.owner.id !== user.id) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, copied, owner, raised, ...rest } = wish;
      await this.wishRepository.update(wishId, { copied: copied + 1 });
      return await this.createWish(user, rest);
    }
  }
}
