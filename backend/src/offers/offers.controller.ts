import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGoard } from 'src/auth/guards/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGoard)
  @Post()
  async createOffer(
    @AuthUser() user: User,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.createOffer(user, createOfferDto);
  }

  @Get()
  async getOffers() {
    return this.offersService.getAllOffers();
  }

  @Get(':id')
  async getOffer(@Param('id') id: number) {
    return await this.offersService.getOffer(id);
  }
}
