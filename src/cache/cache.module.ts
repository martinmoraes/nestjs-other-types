import { Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { redisClientFactory } from './redis/redis-client-factory';
import { CacheService } from './cache.service';

@Module({
  providers: [redisClientFactory, RedisService, CacheService],
  exports: [CacheService],
})
export class CacheModule {}
