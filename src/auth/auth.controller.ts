import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: any) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto)
  }

  @Get('me/:userId')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser('id') userId: number) {
    return this.authService.me(userId)
  }

  



  
}
