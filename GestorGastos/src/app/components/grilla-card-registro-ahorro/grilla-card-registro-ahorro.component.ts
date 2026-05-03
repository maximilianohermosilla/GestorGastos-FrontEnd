import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grilla-card-registro-ahorro',
  templateUrl: './grilla-card-registro-ahorro.component.html',
  styleUrl: './grilla-card-registro-ahorro.component.css',
})
export class GrillaCardRegistroAhorroComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() pageSize?: number;
  @Input() set data(value: any[]) {
    if (value) {
      this._data = value;
    }
  }

  _data: any[] = [];
  length: number = 0;
  isModal: boolean = false;
  dataSource: any;
  nombreColumnas: string[] = ["fecha"];

  cuentas: any[] = [];
  selectedCuenta = 0;

  subtotal: number = 0;

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
    this.subtotal = this.sumarValores(data);
    this.dataSource = new MatTableDataSource<any[]>(data);
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
  }

  getFilters() {
    const cuentasFull = this._data.map(r => r.cuenta).filter(c => c != null);
    const cuentasSet = Array.from(new Map(cuentasFull.map((cta: any) => [cta.id, cta])).values());
    this.cuentas = cuentasSet;
  }

  announceSortChange(sort: Sort) {
    if (sort.direction) {
      this.liveAnnouncer.announce('Sorted${sort.direction}ending');
    }
    else {
      this.liveAnnouncer.announce('sorting cleared');
    }
  }

  selectCuenta(event: any) {
    this.selectedCuenta = event;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.setDatasource(this._data.
      filter(d => (this.selectedCuenta == 0 || (d.cuenta && this.selectedCuenta == d.cuenta.id))));
  }

  sumarValores(lista: any[]) {
    return lista.reduce((acumulador, objeto) => acumulador + objeto.valor, 0);
  }
}
