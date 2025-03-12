import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @IsNotEmpty()
    @MinLength(8)
    password: string

    @Matches(/^09\d{9}$/)
    phone: string
}