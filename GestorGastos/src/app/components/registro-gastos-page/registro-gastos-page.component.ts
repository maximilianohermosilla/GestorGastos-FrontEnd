import { Component } from '@angular/core';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { Cuenta } from 'src/app/models/cuenta';
import { Empresa } from 'src/app/models/empresa';
import { Registro } from 'src/app/models/registro';
import { RegistroVinculado } from 'src/app/models/registro-vinculado';
import { Suscripcion } from 'src/app/models/suscripcion';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { RegistroService } from 'src/app/services/registro.service';
import { RegistroVinculadoService } from 'src/app/services/registrovinculado.service';
import { SuscripcionService } from 'src/app/services/suscripcion.service';

@Component({
  selector: 'app-registro-gastos-page',
  templateUrl: './registro-gastos-page.component.html',
  styleUrl: './registro-gastos-page.component.css'
})
export class RegistroGastosPageComponent {
  dataSource: any;
  periodo: string = "";

  listaCategoriaGasto: CategoriaGasto[] = [];
  listaEmpresas: Empresa[] = [];
  listaCuentas: Cuenta[] = [];
  
  listaRegistros: Registro[] = [];
  listaRegistrosVinculados: RegistroVinculado[] = [];
  listaSuscripciones: Suscripcion[] = [];

  constructor(private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService,
    private registroService: RegistroService, private suscripcionService: SuscripcionService, private registroVinculadoService: RegistroVinculadoService
  ){

  }

  ngOnInit(){
    this.getCategoriaGastos();
    this.getEmpresas();
    this.getCuentas();
  }

  getPeriodo(periodo: string){
    console.log(periodo);
    this.periodo = periodo;
    this.getRegistros(periodo);
    this.getRegistrosVinculados(periodo);
    this.getSuscripciones(periodo);
  }
  
  getRegistros(periodo: string) {
    let idUsuario: number = 1;
    
    this.registroService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      // console.log(rta);
      this.listaRegistros = rta;
    });

  }

  getSuscripciones(periodo: string) {
    let idUsuario: number = 1;
    
    this.suscripcionService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      // console.log(rta);
      this.listaSuscripciones = rta;
    });

  }
  
  getRegistrosVinculados(periodo: string) {
    let idUsuario: number = 1;
    
    this.registroVinculadoService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      // console.log(rta);
      this.listaRegistrosVinculados = rta;
    });

  }

  getCategoriaGastos(){
    this.categoriaGastoService.GetAll().subscribe((rta: CategoriaGasto[]) => {
      this.listaCategoriaGasto = rta;
      // console.log(this.listaCategoriaGasto);
    });
  }
  
  getEmpresas(){
    this.empresaService.GetAll().subscribe((rta: Empresa[]) => {
      this.listaEmpresas = rta;
      // console.log(this.listaEmpresas);
    });
  }
    
  getCuentas(){
    this.cuentaService.GetAll().subscribe((rta: Cuenta[]) => {
      this.listaCuentas = rta;
      // console.log(this.listaCuentas);
    });
  }
}
