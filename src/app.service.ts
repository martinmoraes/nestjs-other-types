import { Injectable } from '@nestjs/common';
import { CacheService } from './cache/cache.service';

@Injectable()
export class AppService {
  constructor(private readonly streamService: CacheService) {}

  getHello(): string {
    return 'Hello World!';
  }

  redisPing() {
    return this.streamService.ping();
  }
}
