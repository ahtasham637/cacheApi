import { NestFactory } from '@nestjs/core';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cache Api')
    .setDescription('Cache api for storing and retrieving cache data')
    .setVersion('1.0')
    .addTag('Cache, FashionCloud')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);



  await app.listen(3000);
}
bootstrap();
