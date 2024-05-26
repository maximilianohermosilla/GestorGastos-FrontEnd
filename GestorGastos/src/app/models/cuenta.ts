export interface Cuenta{
    id: number,
    nombre: string,
    idTipoCuenta: number,
    tipoCuentaNombre?: string,
    idTarjeta?: number,
    tarjetaNumero?: string,
    idUsuario: number,
    usuarioNombre?: string,
    habilitado: boolean
  }