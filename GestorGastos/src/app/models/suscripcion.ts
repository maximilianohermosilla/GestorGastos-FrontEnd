import { Registro } from "./registro";

export interface Suscripcion {
  id: number,
  nombre: string,
  fechaDesde: string,
  fechaHasta: string,
  valorActual: Number,
  idUsuario: number,
  usuarioNombre: string,
  registros?: Registro[]
}