import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { setSwaggerConfig } from './common/config/swagger.config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Swagger 설정
  setSwaggerConfig(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
