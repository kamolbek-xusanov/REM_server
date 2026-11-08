import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto/pagination-query.dto.js';

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
