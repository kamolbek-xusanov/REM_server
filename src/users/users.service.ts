import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

const userSelect = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
} as const


@Injectable()
export class UsersService {
  
  constructor(private prisma: PrismaService){}
  
  async findMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {id: userId},
      select: userSelect
    }) 

    if(!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  async updateMe(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {id: userId},
      data: updateUserDto,
      select: userSelect
    })
    return user
  }
}
