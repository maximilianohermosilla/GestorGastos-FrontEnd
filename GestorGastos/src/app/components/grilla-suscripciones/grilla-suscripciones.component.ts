import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';

@Component({
  selector: 'app-grilla-suscripciones',
  templateUrl: './grilla-suscripciones.component.html',
  styleUrl: './grilla-suscripciones.component.css'
})

export class GrillaSuscripcionesComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data: any;
  @Input() pageSize?: number;

  dataSource: any;  
  sortedData: any;
  nombreColumnas: string[] = ["nombre", "fechaDesde", "valorActual", "registros"];

  
  constructor(private liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    setTimeout(() => {
      this.setDatasource();
    }, 1000);
  } 
  
  ngOnChanges() {
    this.setDatasource();
  }

  setDatasource(){
    this.dataSource = new MatTableDataSource<any[]>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  getDetalle(data: any){
    console.log(data)
    console.log(data.registros)
    const dialogRef = this.dialog.open(GrillaCardRegistroComponent, {
      width: '640px',
      maxWidth: '90vw',
      disableClose: false, 
      data: data.registros 
    });
    dialogRef.afterClosed().subscribe( res => {
      console.log(res)
      //if (res) { // Solo si el modal devuelve algo relevante
        //this.getCuentas(); // Actualizas la lista de cuentas inmediatamente
        console.log("Cierro modal cuenta");
        //this.listaCuentas = [...this.listaCuentas, nuevaCuenta];
        this.cdr.detectChanges();
      //}
    })   
  }
}
