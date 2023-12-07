import { Global, Module } from '@nestjs/common'
import { CustomRedisService } from './service/redis/redis.service';
import { EntityFactory } from './entity/entity.factory';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [CustomRedisService, EntityFactory],
  exports: [CustomRedisService, EntityFactory]
})
export class GlobalModule {}
