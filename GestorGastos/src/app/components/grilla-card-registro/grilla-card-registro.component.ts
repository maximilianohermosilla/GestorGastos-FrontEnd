import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grilla-card-registro',
  templateUrl: './grilla-card-registro.component.html',
  styleUrl: './grilla-card-registro.component.css',
})
export class GrillaCardRegistroComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() pageSize?: number;
  @Input() tipoRegistro?: string;
  @Input() set data(value: any[]) {
    if (value) {
      this._data = value;
    }
  }

  _data: any[] = [];
  length: number = 0;
  isModal: boolean = false;
  title = 'Grilla';
  showFiller = false;
  isAdmin: boolean = false;
  userName = "";
  dataSource: any;
  sortedData: any;
  nombreColumnas: string[] = ["fecha"];

  categorias: any[] = [];
  cuentas: any[] = [];
  selectedCategoria = 0;
  selectedCuenta = 0;

  constructor(private liveAnnouncer: LiveAnnouncer, @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any) {
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.dialogData) {
        this._data = this.dialogData;
        this.isModal = true;
      }
      this.setDatasource(this._data);
      this.getFilters();
    }, 100);
  }

  ngOnChanges() {
    this.setDatasource(this._data);
    this.getFilters();
  }

  setDatasource(data: any[]) {
    this.length = data.length;
    this.dataSource = new MatTableDataSource<any[]>(data);
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  getFilters() {
    const categoriasFull = this._data.map(c => c.categoriaGasto);
    const categoriasSet = Array.from(new Map(categoriasFull.map((cat: any) => [cat.id, cat])).values());

    const cuentasFull = this._data.map(r => r.cuenta);
    const cuentasSet = Array.from(new Map(cuentasFull.map((cta: any) => [cta.id, cta])).values());

    this.categorias = categoriasSet;
    this.cuentas = cuentasSet;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sort: Sort) {
    if (sort.direction) {
      this.liveAnnouncer.announce('Sorted${sort.direction}ending');
    }
    else {
      this.liveAnnouncer.announce('sorting cleared');
    }
  }

  selectCategoria(event: any) {
    this.selectedCategoria = event;
    this.aplicarFiltros();
  }

  selectCuenta(event: any) {
    this.selectedCuenta = event;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.setDatasource(this._data.
      filter(d => (this.selectedCuenta == 0 || this.selectedCuenta == d.cuenta.id) &&
        (this.selectedCategoria == 0 || this.selectedCategoria == d.categoriaGasto.id)));
  }
}
