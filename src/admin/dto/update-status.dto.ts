import { PropertyStatus } from "@prisma/client";
import { IsIn } from "class-validator";

export class UpdateStatusDto {
    @IsIn([PropertyStatus.APPROVED, PropertyStatus.REJECTED])
    status: PropertyStatus
}