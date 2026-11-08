import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common'
import { InquiriesService } from './inquiries.service.js'
import { CreateInquiryDto } from './dto/create-inquiry.dto.js'
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js'
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js'



@Controller()
@UseGuards(JwtAuthGuard)
export class InquiriesController {

  constructor(private readonly inquiriesService: InquiriesService) { }

  @Post('properties/:propertyId/inquiries')
  create(
    @CurrentUser('id') userId: number,
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() dto: CreateInquiryDto
  ) {
    return this.inquiriesService.create(userId, propertyId, dto)
  }



  @Get('inquiries/my')
  findMine(@CurrentUser('id') userId: number) {
    return this.inquiriesService.findMine(userId)
  }
}