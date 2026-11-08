import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message: string

  
  @IsOptional()
  @IsString()
  phone?: string
}