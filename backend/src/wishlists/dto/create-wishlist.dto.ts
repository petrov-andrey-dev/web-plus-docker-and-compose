import { IsArray, IsString, IsUrl, Length } from 'class-validator';

export class CreateWishlistDTO {
  @IsString()
  @Length(2, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  itemsId: number[];
}
