import { UserStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsInt, IsOptional, Matches, Min } from "class-validator";

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

    @IsOptional()
    @Matches(/^09\d{9}$/)
    phone?: string

    @IsOptional()
    @IsEmail()
    email?: string
}