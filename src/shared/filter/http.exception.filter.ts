import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'
import { Request, Response } from 'express'
import { BaseResponse } from '../service/base.service'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('http-exception')
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const { message } = exception.getResponse() as { message: string }

    const rsp = BaseResponse.failed(message, status, request['traceId'])
    this.logger.error(rsp, exception.stack)
    response.status(status).json(rsp)
  }
}
