import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
    @IsEmail()
    email: string

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is requires'})
    password: string
}