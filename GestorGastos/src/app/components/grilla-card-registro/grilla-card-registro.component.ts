import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, Input, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  @Input() pageSize?: number;
  @Input() tipoRegistro?: string;
  @Input() set data(value: any[]) {
    if (value) {
      this._data = value;
    }
  }
  
  private _data: any[] = [];
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
  selectedCategoria = '0';
  selectedCuenta = '0';

  constructor(private liveAnnouncer: LiveAnnouncer, @Optional() @Inject(MAT_DIALOG_DATA) public dialogData: any){
  }
  ngOnInit(): void {
    setTimeout(() => {
      if (this.dialogData) {
        this._data = this.dialogData;
        this.isModal = true;
      }
      this.setDatasource();
    }, 100);
  } 
  
  ngOnChanges() {
    this.setDatasource();
  }

  setDatasource(){    
    this.categorias = this._data.map(r => r.categoria).filter((categoria, index, self) => self.indexOf(categoria) === index);
    this.cuentas = this._data.map(r => r.cuenta).filter((cuenta, index, self) => self.indexOf(cuenta) === index);

    console.log(this.categorias)
    console.log(this.cuentas)
    this.length = this._data.length;
    this.dataSource = new MatTableDataSource<any[]>(this._data);
    this.dataSource.paginator = this.paginator!;
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
