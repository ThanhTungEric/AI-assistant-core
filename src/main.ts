import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AI-Assistant API')
    .setDescription('API Document')
    .setVersion('1.0')
    .addTag('')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, documentFactory)
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret',
      resave: false,
      saveUninitialized: false,
      // session time
      cookie: {
        maxAge: 60 * 1000,
        httpOnly: true,
      },
    })
  )

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })

  app.use(passport.initialize())
  app.use(passport.session())
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
