export interface RegistroAhorro {
    id: number;
    descripcion: string;
    idCuenta?: number;
    fecha: string;
    valor: number;
    diferencia: number;
    idUsuario?: number;
    observaciones?: string;
    periodo?: string;
}
