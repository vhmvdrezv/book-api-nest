import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from './common/logger/app.logger';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // adding global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // use customwinston logger globally
  const logger = new AppLogger();
  app.useLogger(logger);
  // use global filter
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000)

  await app.listen(port);
}
bootstrap();
