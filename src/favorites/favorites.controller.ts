import { Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { FavoritesService } from './favorites.service.js'
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js'

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {

  constructor(private readonly favoritesService: FavoritesService) { }


  @Get()
  findMine(@CurrentUser('id') userId: number) {
    return this.favoritesService.findMine(userId)
  }


  @Post(':propertyId')
  add(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe) propertyId: number
  ) {
    return this.favoritesService.add(userId, propertyId)
  }



  @Delete(':propertyId')
  remove(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe) propertyId: number
  ) {
    return this.favoritesService.remove(userId, propertyId)
  }
}