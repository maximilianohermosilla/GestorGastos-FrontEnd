import { Registro } from "./registro";

export interface Suscripcion {
  id: number,
  nombre: string,
  fechaDesde: string,
  fechaHasta: string,
  valorActual: Number,
  idUsuario: number,
  idEmpresa?: number,
  idCuenta?: number,
  idCategoriaGasto?: number,
  usuarioNombre: string,
  registros?: Registro[],
  fechaUpdate?: string,
  proximoMes?: boolean
}