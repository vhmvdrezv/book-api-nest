import { BookGenre, BookStatus } from "@prisma/client"
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Max, MaxLength, Min, MinLength } from "class-validator"

export class CreateBookDto {

    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title: string

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price: number

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock: number

    @IsNotEmpty()
    @IsEnum(BookGenre)
    genre: BookGenre

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    writerIds: number[]

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(BookStatus)
    status?: BookStatus
}