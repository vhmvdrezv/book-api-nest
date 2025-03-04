import { IsInt, IsNotEmpty } from "class-validator";

export class AddBookWriterDto {
    @IsNotEmpty()
    @IsInt()
    writerId: number
}