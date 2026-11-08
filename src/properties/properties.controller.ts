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
import { QueryPropertiesDto } from './dto/query-properties.dto.js'
import { UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from './multer.config.js'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@CurrentUser('id') userId: number, @Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(userId, dto)
  }

  @Get()
  findAll(@Query() query: QueryPropertiesDto) {
    return this.propertiesService.findAll(query)
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


  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  addImage(@Param('id', ParseIntPipe) id: number, @CurrentUser('id') userId: number, @UploadedFile() file: Express.Multer.File) {
    return this.propertiesService.addImage(id, userId, file)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.propertiesService.remove(id, userId)
  }

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  removeImage(@Param('id', ParseIntPipe) id: number, @Param('imageId', ParseIntPipe) ImageId: number, @CurrentUser('id') userId: number) {
    return this.propertiesService.removeImage(id, ImageId, userId)
  }
}