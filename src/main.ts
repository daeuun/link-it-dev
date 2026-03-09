import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { setSwaggerConfig } from './common/config/swagger.config';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  setupGlobalPipes(app);
  setSwaggerConfig(app);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();

/** * 전역 검증 파이프 설정
 */
 function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되어 있지 않은 속성 제거 
      forbidNonWhitelisted: true, // 허용되지 않은 속성이 포함된 요청 거부
      transform: true, // DTO에 정의된 타입으로 변환
      transformOptions: { enableImplicitConversion: true }, // 타입 변환
    }),
  );
}

/**
 * 보안 설정 (CORS)
 */
function setupSecurity(app: INestApplication) {
  app.enableCors();
}
