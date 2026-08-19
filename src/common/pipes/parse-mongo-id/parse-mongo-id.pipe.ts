import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import {isValidObjectId} from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {//
  transform(value: string, metadata: ArgumentMetadata) {
    //console.log({value, metadata});//muestra el valor y el metadata que se le pasa al pipe
    
    if (!isValidObjectId(value)) {//si el valor que se le pasa al pipe no es un id valido de mongo, lanza una excepcion de bad request
      throw new BadRequestException(`"${value}" no es un id valido de mongo`);
    }
    
    return value;//retorna el valor que se le pasa al pipe
  }
}
