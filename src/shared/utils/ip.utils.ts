import { Request } from 'express'
import { isEmpty } from './obj.utils';

export function getIp(req: Request, keys: string[]): string {
    const headers = req.headers as Object ; // 获取请求头对象
    if (isEmpty(keys)) {
        return ''
    }
    let ip = ''
    for (let index = 0; index < keys.length; index++) {
        const key = keys[index].toLowerCase()
        const value = headers[key]
        if (isEmpty(value) || (typeof value != 'string')) {
            continue
        }
        if (value.includes(',')) {
            const parts: string[] = value.split(',')
            ip = parts[0]
        }
        ip = value
        break;
    }
    return ip
}

  