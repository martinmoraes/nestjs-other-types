import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  public addToStream(fieldsToStore: Record<string, any>, streamName: string) {
    return this.redisService.addToStream({ fieldsToStore, streamName });
  }

  ping() {
    return this.redisService.ping();
  }
}
