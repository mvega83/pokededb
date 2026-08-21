import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
//adaptador para hacer peticiones HTTP, si quisieramos cambiar de adaptador, 
// solo tendriamos que cambiar la implementacion de este adaptador y no tendriamos que cambiar nada en el servicio de seed
export class AxiosAdapter  implements HttpAdapter {
    private  axios:AxiosInstance= axios
    async get<T>(url:string): Promise<T> {
      try {
        const {data} = await this.axios.get<T>(url);
        return data;
      }catch (error) {
        throw new Error('Error en la solicitud HTTP - GET');
      }
    }

}
