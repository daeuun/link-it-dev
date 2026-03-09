import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validation } from '../utils/validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: validation
    }),
  ],
})
export class AppConfigModule {}