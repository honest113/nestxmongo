import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { httpBadRequest } from '../exception/http-exception';

function toValidate(metatype: Function): boolean {
  const types: Function[] = [String, Boolean, Number, Array, Object];
  return !types.includes(metatype);
}

export class ValidationBodyPipe implements PipeTransform<any> {
  async transform(value: any, { metatype, type }: ArgumentMetadata) {
    if (type !== 'body') return value;

    if (!metatype || !toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      if (errors[0].constraints) {
        httpBadRequest(errors[0].constraints[Object.keys(errors[0].constraints)[0]]);
      }
    }
    return object;
  }
}
