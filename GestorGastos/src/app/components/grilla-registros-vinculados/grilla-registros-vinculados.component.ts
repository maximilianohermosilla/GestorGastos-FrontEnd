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
  @Input() data: any;
  @Input() pageSize?: number;

  dataSource: any;
  sortedData: any;
  nombreColumnas: string[] = ["descripcion", "cuotas", "valorFinal", "registros"];

  constructor(private liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.setDatasource();
    }, 1000);
  }

  ngOnChanges() {
    this.setDatasource();
  }

  setDatasource() {
    // console.log(this.data)
    this.dataSource = new MatTableDataSource<any[]>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    // return `Categoria: ${event.firstEvent.name}
    // Start: ${event.firstEvent.startDate.toLocaleString()}
    // End: ${event.firstEvent.endDate.toLocaleString()}
    // Name: ${event.secondEvent.name}
    // Start: ${event.secondEvent.startDate.toLocaleString()}
    // End: ${event.secondEvent.endDate.toLocaleString()}`;
    return "Tooltip"
  }

  getDetalle(data: any) {
    console.log(this.data)
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
}
