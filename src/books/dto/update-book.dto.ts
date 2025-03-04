import { PartialType } from "@nestjs/mapped-types";
import { CreateBookDto } from "./create-book.dto";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, MaxLength, Min, MinLength } from "class-validator";
import { BookGenre, BookStatus } from "@prisma/client";

export class UpdateBookDto {

    @IsOptional()
    @IsNotEmpty()
    @MinLength(1)
    @MaxLength(255)
    title?: string

    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(BookGenre)
    genre?: BookGenre

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(BookStatus)
    status?: BookStatus
}