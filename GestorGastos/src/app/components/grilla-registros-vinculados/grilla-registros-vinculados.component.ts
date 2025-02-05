import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';
import { AbmRegistroVinculadoComponent } from '../abm-registro-vinculado/abm-registro-vinculado.component';

@Component({
  selector: 'app-grilla-registros-vinculados',
  templateUrl: './grilla-registros-vinculados.component.html',
  styleUrl: './grilla-registros-vinculados.component.css'
})

export class GrillaRegistrosVinculadosComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() _data: any[] = [];
  @Input() pageSize?: number;

  dataSource: any;
  sortedData: any;
  nombreColumnas: string[] = ["descripcion", "cuotas", "valorFinal", "registros"];

  length: number = 0;
  categorias: any[] = [];
  cuentas: any[] = [];
  selectedCategoria = 0;
  selectedCuenta = 0;

  subtotal: number = 0;

  constructor(private liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.setDatasource(this._data);
    }, 1000);
  }

  ngOnChanges() {
    this.setDatasource(this._data);    
    this.getFilters();
  }

  setDatasource(data: any[]) {
    this.length = data.length;
    this.subtotal = this.sumarValores(data);
    this.dataSource = new MatTableDataSource<any[]>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }  

  getFilters() {
    const registros = this._data.map(r => r.registros[0]);
    const categoriasFull = registros.map(c => c.categoriaGasto);
    const categoriasSet = Array.from(new Map(categoriasFull.map((cat: any) => [cat.id, cat])).values());

    const cuentasFull = registros.map(r => r.cuenta);
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

  getTooltipText(event: any) {
    console.log(event)
    return "Tooltip"
  }

  getDetalle(data: any) {
    const dialogRef = this.dialog.open(GrillaCardRegistroComponent, {
      width: "99vw",
      minWidth: "60vw",
      maxHeight: '80vh',
      disableClose: false,
      data: data.registros
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }


  updateRegistro(data: any) {
    const dialogRef = this.dialog.open(AbmRegistroVinculadoComponent, {
      width: "90vw",
      minWidth: "50vw",
      maxHeight: '80vh',
      disableClose: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
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
    this.setDatasource(this._data.filter(d => (this.selectedCuenta == 0 || this.selectedCuenta == d.registros[0].cuenta.id) &&
        (this.selectedCategoria == 0 || this.selectedCategoria == d.registros[0].categoriaGasto.id)));
  }  

  sumarValores(lista: any[]) {
    return lista.reduce((acumulador, objeto) => acumulador + objeto.registros[0].valor, 0);
  }
}
