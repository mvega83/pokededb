import { IsInt, IsPositive, Min, IsString } from "class-validator";

export class CreatePokemonDto {
    @IsInt()
    @IsPositive()
    @Min(1)
    //
    numero: number | undefined;
    //string min lengt 1
    @IsString()
    nombre: string | undefined;
}
