import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  REDIS_CLIENT,
  RedisClient,
  RedisStreamMessage,
} from './redis-client.type';
import { AddToStreamParams, ReadStreamParams } from '../interfaces';
import { ClientClosedError, commandOptions } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}
  onModuleDestroy() {
    this.redis.quit();
  }

  public async addToStream({
    fieldsToStore,
    streamName,
  }: AddToStreamParams): Promise<string> {
    const messageObject = Object.entries(fieldsToStore).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'undefined') {
          return acc;
        }
        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);

        return acc;
      },
      {} as Record<string, string>,
    );

    return this.redis.xAdd(streamName, '*', messageObject, {
      TRIM: {
        strategy: 'MAXLEN',
        strategyModifier: '~',
        threshold: 100,
      },
    });
  }

  public async readStream({
    streamName,
    blockMs,
    count,
    lastMessageId,
  }: ReadStreamParams): Promise<RedisStreamMessage[] | null> {
    try {
      const response = await this.redis.xRead(
        commandOptions({ isolated: true }),
        [
          {
            key: streamName,
            id: lastMessageId,
          },
        ],
        { BLOCK: blockMs, COUNT: count },
      );

      const { messages } = response?.[0];

      return messages || null;
    } catch (error) {
      if (error instanceof ClientClosedError) {
        console.log(`${error.message} ...RECONNECTING`);
        await this.connectToRedis();
        return null;
      }
      console.error(
        `Failed to xRead from Redis Stream: ${error.message}`,
        error,
      );
      return null;
    }
  }

  ping() {
    return this.redis.ping();
  }

  set(key, value) {
    return this.redis.SET(key, value);
  }

  get(ket) {
    return this.redis.GET(ket);
  }

  lpush(key, value) {
    return this.redis.LPUSH(key, value);
  }

  rpush(key, value) {
    return this.redis.RPUSH(key, value);
  }

  lpop(key) {
    return this.redis.LPOP(key);
  }

  rpop(key) {
    return this.redis.RPOP(key);
  }

  private async connectToRedis() {
    try {
      if (!this.redis.isOpen) {
        await this.redis.connect();
      }
    } catch (error) {
      console.error(`[${error.name}] ${error.message}`, error);
    }
  }
}
