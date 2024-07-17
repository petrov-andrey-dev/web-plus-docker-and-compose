import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({ length: 1024 })
  description: string;

  @ManyToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0 })
  copied: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
