import { HttpException, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { BaseService } from '@/shared/service/base.service'
import { Request } from 'express'
import { InputVo } from '../vo/input.vo'
import { isEmpty } from '@/shared/utils/obj.utils'
import { curTs } from '@/shared/utils/time.utils'
import { KafkaService } from '@/shared/service/kafka/kafka.service'
import { KafkaPayload } from '@/shared/service/kafka/kafka.payload'
import { BOUNCE_TOPIC, EVENT_TOPIC, PAGE_TOPIC, SESSION_TOPIC } from '../constant/kafka.constant'

@Injectable()
export class InputService extends BaseService {
  private readonly logger = new Logger(InputService.name)

  constructor(
    private readonly kafkaService: KafkaService
  ) {
    super()
  }

  async input(vo: InputVo, req: Request) {
    //检查SDK是否初始化
    if (!this.checkInitializedState(vo)) {
      throw new UnauthorizedException()
    }
    const appId = req['appId']
    const ip = req['clientIp']
    const traceId = req['traceId']
    const now = curTs()
    let rawBody = `${req['rawBody']}&ip=${ip}`
    let sessionId = vo.session_id
    let sessionTime = vo.session_time
    let data = {}
    //生成sessionId
    if (vo.begin_session == '1') {
      sessionId = traceId
      sessionTime = now.toString()
      // 加上 session信息
      rawBody = `${rawBody}&session_id=${sessionId}&session_time=${sessionTime}`
      data = { session_id: sessionId, session_time: sessionTime }
    } else if (isEmpty(sessionId) || isEmpty(sessionTime)) {
      return this.responseSuccess({})
    }

    //入消息队列
    const payload = {
      body: rawBody,
      createdTime: now,
      firstVisitTime: vo.create_time,
      installChannel: vo.install_channel,
      appId
    } as KafkaPayload

    let topic = ''
    if (vo.begin_session == '1' || vo.end_session == '1' || vo.session_duration) {
      topic = SESSION_TOPIC
    } else if (vo.events) {
      topic = EVENT_TOPIC
    } else if (vo.pages) {
      topic = PAGE_TOPIC
    } else if (vo.bounces) {
      topic = BOUNCE_TOPIC
    }
    if (isEmpty(topic)) {
      return this.responseSuccess({})
    }
    const ok = await this.kafkaService.sendMessage(topic, vo.device_id, payload)
    if (!ok) {
      throw new HttpException(`kafka error: ${topic}`, 500)
    }
    return this.responseSuccess(data)
  }

  checkInitializedState(vo: InputVo): boolean {
    if (isEmpty(vo.device_no) || isEmpty(vo.create_time) || isEmpty(vo.install_channel)) {
      return false
    }
    return true
  }
}
