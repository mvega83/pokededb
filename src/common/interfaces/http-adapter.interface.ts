export interface HttpAdapter {
    get<T>(url:string): Promise<T>;
    //<T> es un genérico que permite especificar el tipo de dato que se espera recibir
}