import { Injectable } from '@nestjs/common';
import axios,{AxiosInstance} from 'axios';
import { estructuraPokeRespuestaAPI } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
 
  private readonly axios:AxiosInstance= axios

  async ejecutarSeed() {
    const {data} = await this.axios.get<estructuraPokeRespuestaAPI>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    data.results.forEach(( {name, url }) => {
      const segments = url.split('/');
      const numero:number = parseInt(segments[segments.length - 2]);
      console.log({name, numero});
    });

    return data.results;
  }
}
