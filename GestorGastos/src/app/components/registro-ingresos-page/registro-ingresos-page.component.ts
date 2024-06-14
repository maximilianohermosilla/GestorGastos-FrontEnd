import { Component } from '@angular/core';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { Ingreso } from 'src/app/models/ingreso';
import { CategoriaIngresoService } from 'src/app/services/categoria-ingreso.service';
import { IngresoService } from 'src/app/services/ingreso.service';

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

