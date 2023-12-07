import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as querystring from 'querystring';

@Injectable()
export class RawBodyParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    req['rawBody'] = req.body.toString()
    req.body = querystring.parse(decodeURIComponent(req.body.toString()));
    next();
  }
}
