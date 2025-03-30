import { OrderStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from "class-validator";

export class GetAdminOrdersDto {
    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}