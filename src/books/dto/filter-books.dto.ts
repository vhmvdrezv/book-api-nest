import { BookGenre } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class FilterBooksDto {
    @IsOptional()
    @IsNotEmpty()
    search?: string

    @IsOptional()
    @IsEnum(BookGenre)
    genre: BookGenre
}