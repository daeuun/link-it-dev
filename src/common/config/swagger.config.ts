import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

export function setSwaggerConfig(app: INestApplication) {
    const configService = app.get(ConfigService);
    const user = configService.getOrThrow<string>('SWAGGER_USER');
    const password = configService.getOrThrow<string>('SWAGGER_PASSWORD');

    app.use('/api', basicAuth.default({
        users: { [user]: password },
        challenge: true
    }));

    const config = new DocumentBuilder()
        .setTitle('LinkIt API')
        .setDescription('LinkIt API 문서')
        .setVersion('1.0')
        .addTag('linkit')
        .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' }, 'Bearer')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true
        }
    });
}