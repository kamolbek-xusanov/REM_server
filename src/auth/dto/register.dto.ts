import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {

    @IsString({ message: 'Fullname must be a string'})
    @IsNotEmpty()
    fullName: string

    @IsEmail()
    email: string

    @IsString({ message: 'Password must be a string'})
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    password: string

    @IsOptional()
    @IsString({ message: 'Phone must be a string'})
    phone?:string
}
