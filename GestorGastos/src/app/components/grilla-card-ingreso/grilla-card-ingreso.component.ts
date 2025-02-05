import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grilla-card-ingreso',
  templateUrl: './grilla-card-ingreso.component.html',
  styleUrl: './grilla-card-ingreso.component.css'
})
export class GrillaCardIngresoComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data: any;
  @Input() pageSize?: number;
  
  title = 'Grilla';
  showFiller = false;
  isAdmin: boolean = false;
  userName = "";
  dataSource: any;  
  nombreColumnas: string[] = ["fecha"];

  length: number = 0;
  categorias: any[] = [];
  selectedCategoria = 0;

  subtotal: number = 0;
  
  constructor(private liveAnnouncer: LiveAnnouncer){
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.setDatasource(this.data);
      this.getFilters();
    }, 1000);
  } 
  
  ngOnChanges() {
    this.setDatasource(this.data);
    this.getFilters();
  }

  setDatasource(data: any[]){
    this.length = data.length;
    this.subtotal = this.sumarValores(data);
    this.dataSource = new MatTableDataSource<any[]>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFilters() {
    const categoriasFull = this.data.map((c: any) => c.categoriaIngreso);
    const categoriasSet = Array.from(new Map(categoriasFull.map((cat: any) => [cat.id, cat])).values());

    this.categorias = categoriasSet;
  }
  
  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sort: Sort){
    if (sort.direction){
      this.liveAnnouncer.announce('Sorted${sort.direction}ending');
    }
    else{
      this.liveAnnouncer.announce('sorting cleared');
    }
  }
  
  selectCategoria(event: any) {
    this.selectedCategoria = event;
    this.aplicarFiltros();
  } 

  aplicarFiltros() {
    this.setDatasource(this.data.
      filter((d: any) => this.selectedCategoria == 0 || this.selectedCategoria == d.categoriaIngreso.id));
  }

  sumarValores(lista: any[]) {
    return lista.reduce((acumulador, objeto) => acumulador + objeto.valor, 0);
  }
}