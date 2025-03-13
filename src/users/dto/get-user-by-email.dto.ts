import { IsEmail, IsNotEmpty } from "class-validator";

export class GetUserByEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
}