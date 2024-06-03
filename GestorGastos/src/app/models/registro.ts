import { CategoriaGasto } from "./categoria-gasto"
import { Cuenta } from "./cuenta"
import { Suscripcion } from "./suscripcion"

export interface Registro{
    id: number,
    descripcion: string,
    idEmpresa?: number,
    empresaNombre?: string,
    idSuscripcion?: number,
    suscripcion?: Suscripcion,
    idCategoriaGasto: number,
    categoriaGastoNombre?: string,
    categoriaGasto?: CategoriaGasto,
    idCuenta: number,
    cuenta?: Cuenta,
    idRegistroVinculado?: number,
    registroVinculado?: any,
    numeroCuota?: number,
    fecha: string,
    valor: number,
    idUsuario: number,
    observaciones?: string,
    periodo?: string,
    pagado: boolean,
    fechaPago?: string
}