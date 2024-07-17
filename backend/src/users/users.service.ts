import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HasingHalper } from 'src/common/helpers/hashing.helper';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number) {
    const user = this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async updateUser(user: User, updateUserDTO: UpdateUserDTO) {
    if (updateUserDTO.email && updateUserDTO.email != user.email) {
      const emailExists = this.findOne(updateUserDTO.email);
      if (emailExists) {
        throw new ConflictException(
          'Пользователь с уазанной почтой уже существует',
        );
      }
    }
    if (updateUserDTO.username && updateUserDTO.username != user.username) {
      const emailExists = this.findOne(updateUserDTO.username);
      if (emailExists) {
        throw new ConflictException(
          'Пользователь с уазанным логином уже существует',
        );
      }
    }
    if (updateUserDTO.password) {
      updateUserDTO.password = await HasingHalper.hash(updateUserDTO.password);
    }
    await this.userRepository.update(user.id, updateUserDTO);
    return await this.findById(user.id);
  }

  async findOne(query: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  async getWishes(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user.wishes;
  }

  async findMany(query: string) {
    return this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async createUser(createUserDto: CreateUserDTO) {
    const user = await this.userRepository.find({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (user.length) {
      throw new ConflictException(
        'Пользователь с уазанной почтой или логином уже существует',
      );
    }
    const { password, ...rest } = createUserDto;
    const hash = await HasingHalper.hash(password);
    const newUser = this.userRepository.create({ password: hash, ...rest });
    return await this.userRepository.save(newUser);
  }
}
