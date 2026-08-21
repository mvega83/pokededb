import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginacionDto {//parametros de paginacion para la busqueda de pokemones
    //ejemplo de query: http://localhost:3000/pokemon?limite=10&offset=20
    @IsOptional()
    @IsPositive()
    @Min(1)
    limite: number;//

    @IsOptional()
    @IsPositive()
    offset: number;
}