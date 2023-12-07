import { MiddlewareConsumer, Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./config/configuration";
import { LoggerModule } from "nestjs-pino";
import { KafkaModule } from "@/shared/service/kafka/kafka.module";
import { ScheduleModule } from "@nestjs/schedule";
import { getLogConfig } from "./config/logger.config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SnakeNamingStrategy } from "./typeorm/snake-naming.strategy";
import { InitModule } from "./init-module/init.module";
import { RedisModuleOptions, RedisModule } from '@liaoliaots/nestjs-redis'
import { APP_PIPE } from "@nestjs/core";
import { paramMiddleware } from "./shared/middleware/param.middleware";
import { CustomRedisService } from "./shared/service/redis/redis.service";
import { RawBodyParserMiddleware } from "./shared/middleware/rawBody.parser.middleware";
import { RawBodyMiddleware } from "./shared/middleware/rawBody.middleware";
import { GlobalModule } from "./shared/global.module";
import { InputModule } from "./input-module/input.midule";

@Module({
  imports: [
    // 配置文件注入
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // 定时任务
    ScheduleModule.forRoot(),
    // 日志模块注入
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getLogConfig,
    }),
    // typeorm module 注入
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const result = config.get('mysql')
        result.driver = require(result.driver || 'mysql2')
        result.autoLoadEntities = true
        result.namingStrategy = new SnakeNamingStrategy()
        result.username = result.username
        result.password = result.password
        result.host = result.host
        return result
      },
      inject: [ConfigService]
    }),
    // Redis模块注入
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const options = {} as RedisModuleOptions
        const redis = configService.get('redis')
        options.readyLog = true
        options.config = redis
        return options
      },
      inject: [ConfigService]
    }),
    // kafka 模块
    KafkaModule.forRootAsync(),
    GlobalModule,
    InitModule,
    InputModule
  ],
  controllers: [],
  providers: [ConfigService, CustomRedisService ,{
    provide: APP_PIPE,
    useClass: ValidationPipe
  }],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RawBodyMiddleware, RawBodyParserMiddleware, paramMiddleware)
      .forRoutes('*');
  }
}
