import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import serverConfig from './database/config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = serverConfig.PORT || 3012;
  const config = new DocumentBuilder()
    .setTitle('Project API')
    .setDescription('Project Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        schema: 'Bearer',
        bearerFormat: 'Token',
      } as SecuritySchemeObject,
      'Bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    Logger.debug(`app listening on port ${port}`);
  });
}
bootstrap();