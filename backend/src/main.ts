import { NestFactory } from '@nestjs/core';
import {
  VersioningType,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from '@common/filters/prisma-client-exception.filter';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Đăng ký lưới lọc bắt lỗi Prisma toàn cục
  app.useGlobalFilters(
    new AllExceptionsFilter(), // Bắt tất cả lỗi còn sót lại
    new PrismaClientExceptionFilter(), // Bắt lỗi từ Prisma Client
    new HttpExceptionFilter(), // Bắt lỗi HTTP
  );

  // Tạo prefix chung (Ví dụ: 'api')
  app.setGlobalPrefix('api');

  // Kích hoạt Versioning (Ví dụ: 'v1')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
