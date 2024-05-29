import { Registro } from './registro'

export interface RegistroVinculado{    
    id: number,
    descripcion: string,
    cuotas: number,
    valorFinal: number,
    idUsuario: number,
    registros?: Registro[]
}