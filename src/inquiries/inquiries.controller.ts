import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InquiriesService } from './inquiries.service.js';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  create(@Body() createInquiryDto: CreateInquiryDto) {
    return this.inquiriesService.create(createInquiryDto);
  }

  @Get()
  findAll() {
    return this.inquiriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryDto: UpdateInquiryDto) {
    return this.inquiriesService.update(+id, updateInquiryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiriesService.remove(+id);
  }
}
