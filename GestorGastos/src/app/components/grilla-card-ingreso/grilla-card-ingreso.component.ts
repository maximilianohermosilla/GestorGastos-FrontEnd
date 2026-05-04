import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  @Input() set data(value: any[]) {
    if (value) {
      this._data = value;
    }
  }

  _data: any[] = [];
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
  
  constructor(private liveAnnouncer: LiveAnnouncer, @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any){
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.dialogData) {
        this._data = this.dialogData;
      }
      if (this._data) {
        this.setDatasource(this._data);
        this.getFilters();
      }
    }, 100);
  } 
  
  ngOnChanges() {
    if (this._data) {
      this.setDatasource(this._data);
      this.getFilters();
    }
  }

  setDatasource(data: any[]){
    if (!data) return;
    this.length = data.length;
    this.subtotal = this.sumarValores(data);
    this.dataSource = new MatTableDataSource<any[]>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFilters() {
    const categoriasFull = this._data.map((c: any) => c.categoriaIngreso);
    const categoriasSet = Array.from(new Map(categoriasFull.filter((cat: any) => cat).map((cat: any) => [cat.id, cat])).values());

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
    this.setDatasource(this._data.
      filter((d: any) => this.selectedCategoria == 0 || (d.categoriaIngreso && this.selectedCategoria == d.categoriaIngreso.id)));
  }

  sumarValores(lista: any[]) {
    return lista.reduce((acumulador, objeto) => acumulador + objeto.valor, 0);
  }
}