import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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

  dataSource: any;  
  sortedData: any;
  nombreColumnas: string[] = ["nombre", "fechaDesde", "valorActual", "registros"];

  constructor(private liveAnnouncer: LiveAnnouncer){
  }
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
  }
}
