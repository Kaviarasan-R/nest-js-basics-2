import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { RedisIoAdapter } from './sockets/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: 'http://localhost:5173', credentials: true });

  let redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.connect().catch(console.error);
  let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: 30,
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET,
      cookie: {
        secure: false, // https-enabled website
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      },
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
}
bootstrap();
