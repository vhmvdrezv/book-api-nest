import { UserStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";

export class FilterUsersDto {
    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}