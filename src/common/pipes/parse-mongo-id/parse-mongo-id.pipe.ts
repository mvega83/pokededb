import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {//
  transform(value: string, metadata: ArgumentMetadata) {
    console.log({value, metadata});//muestra el valor y el metadata que se le pasa al pipe
    return value.toUpperCase;//retorna el valor que se le pasa al pipe
  }
}
