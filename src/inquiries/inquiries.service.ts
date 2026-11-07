import { Injectable } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto.js';
import { UpdateInquiryDto } from './dto/update-inquiry.dto.js';

@Injectable()
export class InquiriesService {
  create(createInquiryDto: CreateInquiryDto) {
    return 'This action adds a new inquiry';
  }

  findAll() {
    return `This action returns all inquiries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiry`;
  }

  update(id: number, updateInquiryDto: UpdateInquiryDto) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
