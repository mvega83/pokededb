import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model <Pokemon>
    ){}
  

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.nombre = createPokemonDto.nombre?.toLocaleLowerCase();
    try {
      const pokemono = await this.pokemonModel.create(createPokemonDto);
      return pokemono;
    } catch (error) {
        if (error.code === 11000) {
           throw new BadRequestException(`Pokemon existe in db ${JSON.stringify(error.keyValue)}`);
        }
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let poke: Pokemon | null = null;
    let tipoBusqueda: string = '-1';
    //busca por numero
    if (!isNaN(+term)) {
      tipoBusqueda = 'numero';
      poke = await this.pokemonModel.findOne({ numero: +term }).exec();
    }


    //mongoID
    //busca por id mongo ID
    if (!poke &&isValidObjectId(term)) { //si no encuentra el pokemon y es un id valido de mongo
      tipoBusqueda = 'mongoID';
      poke = await this.pokemonModel.findById(term);
    }

    //Busca por nombre
    if (!poke) {
      if (tipoBusqueda != '-1')
        tipoBusqueda = 'nombre ni '+tipoBusqueda;
      else
        tipoBusqueda = 'nombre';

      poke = await this.pokemonModel.findOne({ nombre: term.toLowerCase().trim() });
    }

    if (!poke) 
      throw new NotFoundException(`No se ha encontrado Pokemon por "${tipoBusqueda}" "${term}" not found`);

    return poke;

  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const poke = await this.findOne(term);//busca el pokemon por el termino que se le pase
    if (updatePokemonDto.nombre) {//si se le pasa un nombre en el dto, lo convierte a minusculas
      updatePokemonDto.nombre = updatePokemonDto.nombre.toLocaleLowerCase();//convierte a minusculas el nombre del pokemon
    }
    await poke.updateOne(updatePokemonDto, { new: true });//actualiza el pokemon con los datos del dto
    return poke;
  }

  remove(term: string) {
    return `This action removes a #${term} pokemon`;
  }
}
