export interface Tarjeta{
    id: number,
    numero: string,
    vencimiento: any,
    idBanco?: number,
    idTipoTarjeta?: number,
    idUsuario?: number,
    habilitado: boolean
}