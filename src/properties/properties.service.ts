import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto.js';
import { Prisma } from '@prisma/client';
import { QueryPropertiesDto } from './dto/query-properties.dto.js';
import { unlink } from 'fs/promises';
import { join } from 'path';

export type AuthUser = { id: number, role: string } | undefined

@Injectable()
export class PropertiesService {

  constructor(private prisma: PrismaService) { }

  async create(userId: number, createPropertyDto: CreatePropertyDto) {

    const category = await this.prisma.category.findUnique({
      where: { id: createPropertyDto.categoryId }
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return this.prisma.property.create({
      data: { ...createPropertyDto, ownerId: userId },
      include: { images: true, category: true },
    })
  }


  async findOne(id: number, user: AuthUser) {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        owner: { select: { id: true, fullName: true, phone: true } }
      }
    })
    if (!property) {
      throw new NotFoundException('Property not found')
    }

    if (property.status !== 'APPROVED') {
      const isOwner = user?.id === property.ownerId
      const isAdmin = user?.role === 'ADMIN'

      if (!isOwner && !isAdmin) {
        throw new NotFoundException('Property not found')
      }
    }
    return property
  }


  async findAll(query: QueryPropertiesDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const { city, type, rooms, category, minPrice, maxPrice, sort } = query

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice) {
      throw new BadRequestException('minPrice must not be greater than maxPrice')
    }

    const where: Prisma.PropertyWhereInput = { status: 'APPROVED' }

    if (city) {
      where.city = { contains: query.city, mode: 'insensitive' }
    }

    if (type) {
      where.listingType = query.type
    }

    if (rooms !== undefined) {
      where.rooms = rooms
    }

    if (category) {
      if (/^\d+$/.test(category)) {
        where.categoryId = Number(category)
      } else {
        where.category = { slug: category }
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      }
    }

    const orderBy: Prisma.PropertyOrderByWithRelationInput = sort === 'price_asc' ? { price: 'asc' } : sort === 'price_desc' ? { price: 'desc' } : { createdAt: 'desc' }

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { images: true, category: true }
      }),
      this.prisma.property.count({ where })
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }


  async addImage(
    propertyId: number,
    userId: number,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required')
    }

    try {
      const property = await this.prisma.property.findUnique({
        where: { id: propertyId },
      })
      if (!property) {
        throw new NotFoundException('Property not found')
      }

      if (property.ownerId !== userId) {
        throw new ForbiddenException('You can only add images to your own property')
      }

      const last = await this.prisma.propertyImage.findFirst({
        where: { propertyId },
        orderBy: { sortOrder: 'desc' },
      })
      const sortOrder = last ? last.sortOrder + 1 : 0

      return await this.prisma.propertyImage.create({
        data: {
          url: '/uploads/' + file.filename,
          propertyId,
          sortOrder,
        },
      })
    } catch (error) {
      await unlink(file.path).catch(() => { })
      throw error
    }
  }

  async update(id: number, userId: number, updatePropertyDto: UpdatePropertyDto) {
    const property = await this.prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      throw new NotFoundException('Property not found')
    }

    if (property?.ownerId !== userId) {
      throw new ForbiddenException('You can only edit your own property')
    }

    if (updatePropertyDto.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: updatePropertyDto.categoryId }
      })
      if (!category) {
        throw new NotFoundException('Category not found')
      }
    }
    return this.prisma.property.update({
      where: { id },
      data: updatePropertyDto,
      include: { images: true, category: true }
    })

  }

  async remove(id: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      throw new NotFoundException('Property not found')
    }

    if (property?.ownerId !== userId) {
      throw new ForbiddenException('You can only delete your own property')
    }

    await this.prisma.property.delete({ where: { id } })
    return { message: 'Property deleted' }
  }

  async removeImage(propertyId: number, imageId: number, userId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property) {
      throw new NotFoundException("Property not found")
    }

    if (property.ownerId !== userId) {
      throw new ForbiddenException('You can only delete images of your own property')
    }

    const image = await this.prisma.propertyImage.findUnique({
      where: { id: imageId }
    })

    if (!image || image.propertyId !== propertyId) {
      throw new NotFoundException('Image not found')
    }

    await this.prisma.propertyImage.delete({ where: { id: imageId } })

    try {
      await unlink(join(process.cwd(), image.url))
    } catch {

    }

    return { message: 'Image deleted' }
  }


  async findMine(userId: number, query: PaginationQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const where = { ownerId: userId }
    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { images: true, category: true },
      }),
      this.prisma.property.count({ where })
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }
}
