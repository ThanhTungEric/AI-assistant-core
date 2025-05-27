import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
    })
  )

  app.use(passport.initialize())
  app.use(passport.session())
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
