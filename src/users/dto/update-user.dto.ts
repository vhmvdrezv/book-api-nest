import { UserStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    firstName?: string

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    lastName?: string

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(UserStatus)
    status?: UserStatus
}