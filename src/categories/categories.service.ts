import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {

  constructor(private prisma: PrismaService) { }



  async create(createCategoryDto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({ data: createCategoryDto })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Category already exists')
      }
      throw error
    }
  }

  async findAll() {
    return await this.prisma.category.findMany({ orderBy: { name: 'asc' } })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    return await this.prisma.category.update({
      where: {id},
      data: updateCategoryDto
    })
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id }
    })
    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const count = await this.prisma.property.count({ where: { categoryId: id } })
    if (count > 0) {
      throw new ConflictException("Kategoriyada e'lonlar bor")
    }

    return this.prisma.category.delete({ where: { id } })
  }
}
