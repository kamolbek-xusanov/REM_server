import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards, ParseIntPipe, Req, Query,
} from '@nestjs/common'
import { AuthUser, PropertiesService } from './properties.service.js'
import { CreatePropertyDto } from './dto/create-property.dto.js'
import { UpdatePropertyDto } from './dto/update-property.dto.js'
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto.js'
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth/optional-jwt-auth.guard.js'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser('id') userId: number, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(userId, dto)
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user?: AuthUser },
  ) {
    return this.propertiesService.findOne(id, req.user)
  }

  @Get('my/list')
  @UseGuards(JwtAuthGuard)
  findMine(
    @CurrentUser('id') userId: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.propertiesService.findMine(userId, query)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, userId, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.propertiesService.remove(id, userId)
  }
}