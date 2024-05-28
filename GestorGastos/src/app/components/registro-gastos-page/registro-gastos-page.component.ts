import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { Cuenta } from 'src/app/models/cuenta';
import { Empresa } from 'src/app/models/empresa';
import { Registro } from 'src/app/models/registro';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-registro-gastos-page',
  templateUrl: './registro-gastos-page.component.html',
  styleUrl: './registro-gastos-page.component.css'
})
export class RegistroGastosPageComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: any;
  periodo: string = "";

  listaCategoriaGasto: CategoriaGasto[] = [];
  listaEmpresas: Empresa[] = [];
  listaCuentas: Cuenta[] = [];
  
  listaRegistros: Registro[] = [];

  constructor(private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService,
    private registroService: RegistroService
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
  }
  
  getRegistros(periodo: string) {
    let idUsuario: number = 1;

    this.registroService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      console.log(rta);
      this.listaRegistros = rta;
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

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
