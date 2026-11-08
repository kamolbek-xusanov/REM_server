import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class FavoritesService {

  constructor(private prisma: PrismaService) { }

  async add(userId: number, propertyId: number) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property || property.status !== 'APPROVED') {
      throw new NotFoundException('Property not found')
    }

    try {
      return await this.prisma.favorite.create({
        data: { userId, propertyId }
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Already in favorites')
      }
      throw error
    }
  }


  
  async remove(userId: number, propertyId: number) {
    const result = await this.prisma.favorite.deleteMany({
      where: { userId, propertyId }
    })

    if (result.count === 0) {
      throw new NotFoundException('Favorite not found')
    }

    return { message: 'Removed from favorites' }
  }

  async findMine(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId, property: { status: 'APPROVED' } },
      orderBy: { createdAt: 'desc' },
      include: {
        property: { include: { images: true, category: true } }
      }
    })
  }
}