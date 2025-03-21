import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from 'src/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
