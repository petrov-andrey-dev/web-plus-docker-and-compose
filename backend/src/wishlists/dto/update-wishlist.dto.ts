import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDTO } from './create-wishlist.dto';

export class UpdateWishlistDTO extends PartialType(CreateWishlistDTO) {}
