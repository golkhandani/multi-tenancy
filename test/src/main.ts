import { NestFactory } from '@nestjs/core';
import {
  FastestValidatorPipe,
  FastestValidatorExceptionFilter,
} from 'fastest-validator-nestjs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new FastestValidatorPipe());
  app.useGlobalFilters(new FastestValidatorExceptionFilter({
    showStack: false
  }));
  console.log(app.select(AppModule));

  await app.listen(3000);
}
bootstrap();
