import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception'
import { Request, Response } from 'express'
import { BaseResponse } from '../service/base.service'

/**
 * @description: 全局的异常处理
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger('global-exception')
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR

    const message = (exception as RuntimeException).message || 'Internal Error'
    const rsp = BaseResponse.failed(message, status, request['traceId'])
    this.logger.error(rsp, exception.stack)
    response.status(HttpStatus.OK).json(rsp)
  }
}
