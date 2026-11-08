import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminPropertiesQueryDto } from './dto/admin-properties-query.dto.js';
import { PropertyStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async listProperties(query: AdminPropertiesQueryDto) {
    const page = query.page ?? 1
    const limit = query.limit ?? 10
    const status = query.status ?? PropertyStatus.PENDING

    const where = { status }

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          images: true,
          category: true,
          owner: {
            select: { id: true, fullName: true, email: true, phone: true }
          }
        }
      }),
      this.prisma.property.count({ where }),
    ])

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
  }

  async updateStatus(id: number, status: PropertyStatus) {
    const property = await this.prisma.property.findUnique({
      where: { id }
    })

    if (!property) {
      throw new NotFoundException('Property not found')
    }

    return this.prisma.property.update({
      where: { id },
      data: { status },
      include: {
        images: true,
        category: true,
        owner: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    })
  }

  async listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}