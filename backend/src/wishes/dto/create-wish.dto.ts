import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishDTO {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  raised?: number;

  @IsString()
  @Length(1, 1024)
  description: string;
}
