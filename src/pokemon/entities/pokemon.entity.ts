import { Document } from 'mongoose'; //debe de ir
import {  Schema, SchemaFactory, Prop } from '@nestjs/mongoose'; //debe de ir

@Schema()
export class Pokemon extends Document {
    
    @Prop({ //propiedades
        type: String,
        unique: true,
        index: true,
    })
    nombre: string;

    @Prop({
        type: Number,
        unique: true,
        index: true,
    })
    numero: number;

}

export const PokemonSchema1 = SchemaFactory.createForClass ( Pokemon ); // debe de ir debido que es el que va a crear el esquema de la base de datos y lo va a exportar para poder usarlo en otro lado
