import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { isEmpty } from '../utils/obj.utils'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: '入参格式有误',
          error: errors.reduce(
            (obj, { property, constraints, children }) => ({
              ...obj,
              [property]: isEmpty(constraints) ? Object.values(children) : Object.values(constraints)
            }),
            {}
          )
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      )
    }
    return value
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
