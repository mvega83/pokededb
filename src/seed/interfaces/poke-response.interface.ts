export interface estructuraPokeRespuestaAPI {
  count:    number;
  next:     string;
  previous: null;
  results:  Resultados[];
}

export interface Resultados {
  name: string;
  url:  string;
}
