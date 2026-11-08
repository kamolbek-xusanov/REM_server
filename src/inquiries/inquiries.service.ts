import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { CreateInquiryDto } from './dto/create-inquiry.dto.js'

@Injectable()
export class InquiriesService {
  
  constructor(private prisma: PrismaService) { }

  async create(senderId: number, propertyId: number, dto: CreateInquiryDto) {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId }
    })

    if (!property || property.status !== 'APPROVED') {
      throw new NotFoundException('Property not found')
    }

    if (property.ownerId === senderId) {
      throw new BadRequestException('You cannot send an inquiry to your own property')
    }

    return this.prisma.inquiry.create({
      data: {
        message: dto.message,
        phone: dto.phone,
        senderId,
        propertyId
      }
    })
  }



  async findMine(senderId: number) {
    return this.prisma.inquiry.findMany({
      where: { senderId },
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true } }
      }
    })
  }
}