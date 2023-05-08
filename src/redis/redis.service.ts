import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from './redis-client.type';

@Injectable()
// export class RedisService {}
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}
  onModuleDestroy() {
    this.redis.quit();
  }

  ping() {
    return this.redis.ping();
  }
}
