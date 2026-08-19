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
        this.handleExceptions(error);
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

///// esto sirve para primero evaluar si por ejemplo en numero que es unico, si se quiere actualizar a un numero que ya existe, para que no se actualice y se lance la excepcion de duplicado
    try {//actualiza el pokemon con los datos del dto y retorna el pokemon actualizado
      await poke.updateOne(updatePokemonDto, { new: true });
      return {"Se ha actualizado el pokemon": {...poke.toJSON(), ...updatePokemonDto}};//retorna el pokemon actualizado
    }
    catch (error) {//si hay un error al actualizar el pokemon, lanza una excepcion con el mensaje de error
       this.handleExceptions(error);
    }
    
    
  }

  async remove(id:string) {
     /*
      const poke = await this.findOne(id);//busca el pokemon por el id que se le pase
      await poke.deleteOne();
      return {id};
      */

   //  const result = await this.pokemonModel.findByIdAndDelete(id);//elimina el pokemon por el id que se le pase
     //elimina el pokemon por el id que se le pase


     const {deletedCount}= await this.pokemonModel.deleteOne({_id:id});//elimina el pokemon por el id que se le pase
     if (deletedCount === 0) {//si no se elimina ningun pokemon, lanza una excepcion de not found
      throw new NotFoundException(`Pokemon with id "${id}" no encontrado`);
     }
     return {deletedCount};//retorna el pokemon eliminado
  }

  private handleExceptions(error: any) { // funcion para manejar las excepciones de la base de datos, si es un error de duplicado lanza una excepcion de bad request, si es otro error lanza una excepcion de internal server error
    if (error.code === 11000) {
       if (error.code === 11000) {//si el error es por duplicado, lanza una excepcion de bad request con el mensaje de error
          throw new BadRequestException(`Pokemon existe in db ${JSON.stringify(error.keyValue)}`);
        }
        console.log(error);
        throw new InternalServerErrorException(`No puede actualizar el pokemon - Chequea los logs del servidor`);
      
    }
  }
}
