import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateWriterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string

    @IsOptional()
    @IsNotEmpty()
    @MaxLength(1023)
    bio?: string
}