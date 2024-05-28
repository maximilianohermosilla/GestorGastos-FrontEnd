import { Component } from '@angular/core';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { Cuenta } from 'src/app/models/cuenta';
import { Empresa } from 'src/app/models/empresa';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { EmpresaService } from 'src/app/services/empresa.service';

@Component({
  selector: 'app-registro-gastos-page',
  templateUrl: './registro-gastos-page.component.html',
  styleUrl: './registro-gastos-page.component.css'
})
export class RegistroGastosPageComponent {

  listaCategoriaGasto: CategoriaGasto[] = [];
  listaEmpresas: Empresa[] = [];
  listaCuentas: Cuenta[] = [];


  constructor(private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService){

  }

  ngOnInit(){
    this.getCategoriaGastos();
    this.getEmpresas();
    this.getCuentas();
  }
  
  getCategoriaGastos(){
    this.categoriaGastoService.GetAll().subscribe((rta: CategoriaGasto[]) => {
      this.listaCategoriaGasto = rta;
      console.log(this.listaCategoriaGasto);
    });
  }
  
  getEmpresas(){
    this.empresaService.GetAll().subscribe((rta: Empresa[]) => {
      this.listaEmpresas = rta;
      console.log(this.listaEmpresas);
    });
  }
    
  getCuentas(){
    this.cuentaService.GetAll().subscribe((rta: Cuenta[]) => {
      this.listaCuentas = rta;
      console.log(this.listaCuentas);
    });
  }
}
