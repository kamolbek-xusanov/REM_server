import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export const Roles_Key = (...roles: string[]) => SetMetadata(Roles_Key, roles)
export const Roles = Reflector.createDecorator<string[]>();
