import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "nestjs-pino";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";
import {ExpressAdapter, NestExpressApplication} from '@nestjs/platform-express';
import { GlobalExceptionFilter } from "./shared/filter/global.exception.filter";
import { HttpExceptionFilter } from "./shared/filter/http.exception.filter";

async function bootstrap() {
  // 禁用bodyParser
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {cors: true, bodyParser: false},
  );
  // 全局异常过滤器
  app.useGlobalFilters(new GlobalExceptionFilter(), new HttpExceptionFilter())
  // 全局的日志
  app.useLogger(app.get(Logger));

  const configService = app.get<ConfigService>(ConfigService);

  // swagger 处理
  if (configService.get<boolean>('swagger.enable')) {
    const swaggerConfig = configService.get('swagger')
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setContact(swaggerConfig.title, swaggerConfig.site, swaggerConfig.email)
      .setVersion(swaggerConfig.version || '1.0')
      .addTag(swaggerConfig.tag)
      .addServer(swaggerConfig.serverHost)
      .build()
    const document = SwaggerModule.createDocument(app, config)
    const swaggerOptions: SwaggerCustomOptions = {
      customfavIcon: 'https://docs.nestjs.com/assets/logo/run-players-league.png',
      useGlobalPrefix: true
    }
    SwaggerModule.setup('api/doc', app, document, swaggerOptions)
  }

  await app.listen(configService.get<number>("http.port"));
  console.log(`\nApplication is running on: ${await app.getUrl()}`);
}
bootstrap();
