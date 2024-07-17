import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDTO } from './create-wish.dto';

export class UpdateWishDTO extends PartialType(CreateWishDTO) {}
