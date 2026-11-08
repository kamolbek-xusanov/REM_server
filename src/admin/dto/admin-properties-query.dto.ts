import { IsEnum, IsOptional } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto/pagination-query.dto.js";
import { PropertyStatus } from "@prisma/client";

export class AdminPropertiesQueryDto  extends PaginationQueryDto {
    @IsOptional()
    @IsEnum(PropertyStatus)
    status?: PropertyStatus
}