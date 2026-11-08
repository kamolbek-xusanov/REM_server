import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles/roles.guard.js';
import { Roles } from '../common/decorators/roles/roles.decorator.js';
import { AdminPropertiesQueryDto } from './dto/admin-properties-query.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private adminService: AdminService) { }

  @Get('properties')
  listProperties(@Query() query: AdminPropertiesQueryDto) {
    return this.adminService.listProperties(query)
  }

  @Patch('properties/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.adminService.updateStatus(id, dto.status)
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers()
  }
}