import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber } from "class-validator";

export class AddBookToCartDto {
    @IsNotEmpty()
    @IsInt()
    @Type(() => Number)
    bookId: number
}