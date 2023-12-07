import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { RedisKey, RedisValue, Redis } from 'ioredis'
import { isEmpty } from '@/shared/utils/obj.utils'

// 默认的超时时间(秒)
const DEFAULT_EXPIRE_SECONDS = 15 * 60

@Injectable()
export class CustomRedisService {
  private redisClient: Redis

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getClient()
  }

  set(key: RedisKey, value: RedisValue) {
    return this.redisClient.set(key, value)
  }

  async get(key: RedisKey): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  async exist(key: RedisKey): Promise<boolean> {
    const res = await this.redisClient.exists(key)
    return res === 1
  }

  /**
   * @param {number} timeout 超时时间（秒）
   * @return {*}
   */
  setWithEx(key: RedisKey, value: RedisValue, seconds: number) {
    return this.redisClient.set(key, value, 'EX', seconds * 1000)
  }

  /**
   * @param {number} timeout 超时时间（秒）
   * @return {*}
   */
  setWithExS(key: RedisKey, value: RedisValue, seconds: number) {
    return this.redisClient.set(key, value, 'EX', seconds)
  }

  async del(key: RedisKey): Promise<boolean> {
    const res = await this.redisClient.del(key)
    return res === 1
  }

  async mdel(keys: string[]): Promise<number> {
    const res = await this.redisClient.del(keys)
    return res
  }

  async getLock(key: RedisKey, expire?: number): Promise<boolean> {
    const res = await this.redisClient.setnx(key, '1')
    if (res === 1) {
      await this.redisClient.expire(key, expire ? expire : DEFAULT_EXPIRE_SECONDS)
    }
    return res === 1
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    return await this.redisClient.mget(keys)
  }

  async mset(map: Map<string, string | number>): Promise<string> {
    return await this.redisClient.mset(map)
  }

  async bitcount(key: string): Promise<number> {
    const count = await this.redisClient.bitcount(key)
    if (isEmpty(count)) {
      return 0
    }
    return count
  }

  async setbit(key: string, offset: number): Promise<number> {
    return await this.redisClient.setbit(key, offset, 1)
  }

  async bitop(operation: string, destkey: string, keys: string[]): Promise<any> {
    return await this.redisClient.bitop(operation, destkey, keys)
  }
}
