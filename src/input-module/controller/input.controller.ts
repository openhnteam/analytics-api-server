import { Body, Controller, Post, Req } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { InputService } from '../service/input.service'
import { InputVo } from '../vo/input.vo'

@Controller('i')
@ApiTags('上报日志')
export class InputController {
  constructor(readonly inputService: InputService) {}

  @Post('/')
  @ApiOperation({ summary: '日志上报接口' })
  async input (@Body() vo: InputVo, @Req() req: Request) {
    const rsp = await this.inputService.input(vo, req)
    return rsp
  }
}
