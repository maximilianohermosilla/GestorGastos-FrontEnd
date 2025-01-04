export interface Tarjeta{
    id: number,
    numero: string,
    vencimiento: any,
    idBanco?: number,
    idTipoTarjeta?: number,
    idUsuario?: number,
    tipoTarjetaNombre?: string,
    bancoNombre?: string,
    habilitado: boolean
}