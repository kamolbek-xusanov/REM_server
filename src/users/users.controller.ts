import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator.js';


@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser('id') userId: number) {
    return this.usersService.findMe(userId)
  }

  @Patch('me')
  updateMe(@CurrentUser('id') userId: number, @Body() updateUserDto: UpdateUserDto){ 
    return this.usersService.updateMe(userId, updateUserDto)
  }
}
