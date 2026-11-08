import { ListingType } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";


export class CreatePropertyDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    address: string

    @IsString()
    @IsNotEmpty()
    city: string

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    price: number

    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    area: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    rooms: number

    @Type(() => Number)
    @IsInt()
    @Min(1)
    bathrooms: number

    @IsEnum(ListingType)
    listingType: ListingType

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    categoryId: number

    @IsOptional()
    @IsString()
    currency?: string
}
