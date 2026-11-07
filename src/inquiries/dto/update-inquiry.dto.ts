import { PartialType } from '@nestjs/mapped-types';
import { CreateInquiryDto } from './create-inquiry.dto.js';

export class UpdateInquiryDto extends PartialType(CreateInquiryDto) {}
