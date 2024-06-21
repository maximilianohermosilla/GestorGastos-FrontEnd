import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-grilla-card-registro',
  templateUrl: './grilla-card-registro.component.html',
  styleUrl: './grilla-card-registro.component.css'
})
export class GrillaCardRegistroComponent {
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
  sortedData: any;
  nombreColumnas: string[] = ["fecha"];

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
}
