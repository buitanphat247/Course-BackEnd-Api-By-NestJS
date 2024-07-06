import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // console.log('>>> views: ', join(__dirname, '..', 'views'));
  // console.log('>>> public: ', join(__dirname, '..', 'public'));
  const configService = app.get(ConfigService);
  app.setViewEngine('ejs');
  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
