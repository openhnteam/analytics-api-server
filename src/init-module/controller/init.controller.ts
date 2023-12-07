import { Body, Controller, Post, Req } from '@nestjs/common'
import { InitService } from '../service/init.service'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { InitRspDto } from '../dto/init.rsp.dto'
import { InitVo } from '../vo/init.vo'
import { Request } from 'express'

@Controller('init')
@ApiTags('初始化')
export class InitController {
  constructor(readonly initService: InitService) {}

  @Post('/')
  @ApiOperation({ summary: '初始化sdk' })
  @ApiOkResponse({
    description: '初始化返回值',
    type: InitRspDto
  })
  async init(@Body() vo: InitVo, @Req() request: Request) {
    const rsp = await this.initService.init(vo, request['appId'])
    return rsp
  }
}
