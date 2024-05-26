export interface Ingreso{
    id: number,
    valor: number,
    descripcion: "",
    fecha: "",
    periodo: "",
    idUsuario: number,
    idCategoriaIngreso: number,
    categoriaIngresoNombre?: string
  }