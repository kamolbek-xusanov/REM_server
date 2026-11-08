import { IsEnum, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto/pagination-query.dto.js";
import { ListingType } from "@prisma/client";
import { Type } from "class-transformer";


export class QueryPropertiesDto extends PaginationQueryDto{
    @IsOptional()
    @IsString()
    city?: string

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsEnum(ListingType)
    type?: ListingType

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    rooms?: number

    @IsOptional()
    @IsIn(['price_asc', 'price_desc', 'newest'])
    sort?: 'price_asc' | 'price_desc' | 'newest'
}