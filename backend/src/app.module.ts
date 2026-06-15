// Libraries
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { PrismaModule } from './prisma/prisma.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule có thể dùng ở bất kỳ đâu mà không cần import lại
      envFilePath: '.env', // load cấu hình từ file .env
      cache: true, // cache config để tăng hiệu suất, tránh đọc file nhiều lần
    }),
    PrismaModule,
    AuthModule,
  ],

  providers: [AppService],
  controllers: [AppController],
})
export class AppModule { }
