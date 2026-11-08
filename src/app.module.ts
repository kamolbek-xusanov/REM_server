import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AdminModule } from './admin/admin.module.js';
import { InquiriesModule } from './inquiries/inquiries.module.js';
import { FavoritesModule } from './favorites/favorites.module.js';
import { PropertiesModule } from './properties/properties.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    PropertiesModule,
    FavoritesModule,
    InquiriesModule,
    AdminModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }