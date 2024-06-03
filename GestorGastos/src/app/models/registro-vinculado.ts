import { Registro } from './registro'

export interface RegistroVinculado{    
    id: number,
    descripcion: string,
    cuotas: number,
    valorFinal: number,
    idUsuario: number,
    idCuenta?: number,
    idEmpresa?: number,
    idCategoriaGasto?: number,
    fecha: string,
    registros?: Registro[],
    proximoMes?: boolean
}