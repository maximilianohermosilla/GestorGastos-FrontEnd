import { Component } from '@angular/core';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { Cuenta } from 'src/app/models/cuenta';
import { Empresa } from 'src/app/models/empresa';
import { Ingreso } from 'src/app/models/ingreso';
import { RegistroVinculado } from 'src/app/models/registro-vinculado';
import { Suscripcion } from 'src/app/models/suscripcion';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CategoriaIngresoService } from 'src/app/services/categoria-ingreso.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { IngresoService } from 'src/app/services/ingreso.service';
import { RegistroService } from 'src/app/services/registro.service';
import { RegistroVinculadoService } from 'src/app/services/registrovinculado.service';
import { SuscripcionService } from 'src/app/services/suscripcion.service';

@Component({
  selector: 'app-registro-ingresos-page',
  templateUrl: './registro-ingresos-page.component.html',
  styleUrl: './registro-ingresos-page.component.css'
})
export class RegistroIngresosPageComponent {
  dataSource: any;
  periodo: string = "";

  listaCategoriaIngreso: CategoriaIngreso[] = [];  
  listaIngresos: Ingreso[] = [];

  constructor(private ingresoService: IngresoService, private categoriaIngresoService: CategoriaIngresoService){
  }

  ngOnInit(){
    this.getCategoriaIngresos();
    this.getRegistros(this.periodo);
  }

  getPeriodo(periodo: string){
    this.periodo = periodo;
    this.getRegistros(periodo);
  }
  
  getRegistros(periodo: string) {
    let idUsuario: number = 1;
    
    this.ingresoService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      // console.log(rta);
      this.listaIngresos = rta;
    });

  }

  getCategoriaIngresos(){
    this.categoriaIngresoService.GetAll().subscribe((rta: CategoriaIngreso[]) => {
      this.listaCategoriaIngreso = rta;
      // console.log(this.listaCategoriaGasto);
    });
  }  
}

