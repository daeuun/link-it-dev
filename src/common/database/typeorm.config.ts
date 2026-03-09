import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const setTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const nodeEnv = configService.get<string>('NODE_ENV', 'dev');;
  const isProd = nodeEnv === 'prod';
  const DB_TYPE: 'postgres' | null = 'postgres';

  return {
    type: DB_TYPE,
    host: configService.get<string>(`DB_HOST`),
    port: configService.get<number>(`DB_PORT`),
    username: configService.get<string>(`DB_USERNAME`),
    password: configService.get<string>(`DB_PASSWORD`),
    database: configService.get<string>(`DB_DATABASE`),

    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    autoLoadEntities: true,

    synchronize: isProd ? false : configService.get<boolean>('SYNCHRONIZE', false),
    logging: configService.get<boolean>('DB_LOGGING', false),
    retryAttempts: isProd ? 10 : 1,
    useUTC: false,
  };
}
