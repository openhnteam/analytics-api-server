import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import { SHA256 } from 'crypto-js'
import { baseVo } from '../vo/base.vo'
import { BaseResponse } from '../service/base.service'
import { CustomRedisService } from '../service/redis/redis.service'
import { GlobalVariable } from '../service/global/global.variable'
import { Request } from 'express'
import { v4 as uuidv4 } from 'uuid';
import { getIp } from '../utils/ip.utils'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class paramMiddleware implements NestMiddleware {
  constructor(private readonly customRedisService: CustomRedisService, private readonly configService: ConfigService) {}
  private readonly logger = new Logger(paramMiddleware.name)

  async use(req: Request, res: any, next: () => void) {
    const vo: baseVo = req.body as baseVo
    const appKey: string = vo.app_key
    const checksum256: string = vo.checksum256
    if (!checksum256) {
      res.json(BaseResponse.failed('Illegal request', 400))
      return
    }
    const globalVariable = GlobalVariable.getInstance();
    // 获取全局变量的数据
    let appJsonString:string = globalVariable.getData('key');
    if (!appJsonString) {
       appJsonString = await this.customRedisService.get(appKey)
       globalVariable.setData(appKey, appJsonString);
    }
    if (!appJsonString) {
      res.json(BaseResponse.failed('The application cannot be found', 400))
      return
    }

    const app = JSON.parse(appJsonString)
    const rawBody: string = req['rawBody']
    const extCheckSum256: string = rawBody.replace('&checksum256=' + checksum256, '') + app['salt']
    const hash = SHA256(extCheckSum256).toString().toLowerCase()
    if (hash !== checksum256) {
      res.json(BaseResponse.failed('Illegal request', 400))
      return
    }
    const ngIpKeys = this.configService.get<string[]>('ngIpKeys')
    const traceId: string = uuidv4()
    req['traceId'] = traceId
    req['appId'] = app['appId']
    req['clientIp'] = getIp(req, ngIpKeys)
    next()
  }
}
