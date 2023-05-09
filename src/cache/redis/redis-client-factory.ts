import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const client = createClient({ url: 'redis://redis:6379/0' });
    await client.connect();
    return client;
  },
};
