import { Injectable } from '@nestjs/common';

import { estructuraPokeRespuestaAPI } from './interfaces/poke-response.interface';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
 
  


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model <Pokemon>,
    private readonly http: AxiosAdapter,
  ){}
  
    

  async ejecutarSeed() {
    await this.pokemonModel.deleteMany({}); //elimina todos los registros de la coleccion de pokemon
    /*
   
    //inserta de uno en uno en la base de datos
    const {data} = await this.axios.get<estructuraPokeRespuestaAPI>('https://pokeapi.co/api/v2/pokemon?limit=650');
    data.results.forEach(( {name, url }) => {
      const segments = url.split('/');
      const numero:number = parseInt(segments[segments.length - 2]);
      console.log({name, numero});
    });

    return data.results;*/


    //inserta todos de una vez en la base de datos
    //const {data} = await this.axios.get<estructuraPokeRespuestaAPI>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<estructuraPokeRespuestaAPI>('https://pokeapi.co/api/v2/pokemon?limit=650');//para llamarlo desde el adaptador de axios
    const poleToInsert: {nombre:string, numero:number}[] = [];
    data.results.forEach(( {name, url }) => {
      const segments = url.split('/');
      const numero:number = parseInt(segments[segments.length - 2]);
      poleToInsert.push({nombre: name, numero});
    });

    await this.pokemonModel.insertMany(poleToInsert);
    return 'Seed ejecutado correctamente';
  }
}
