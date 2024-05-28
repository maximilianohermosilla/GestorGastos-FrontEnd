import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Ingreso } from 'src/app/models/ingreso';
import { Registro } from 'src/app/models/registro';
import { Usuario } from 'src/app/models/usuario';
import { IngresoService } from 'src/app/services/ingreso.service';
import { LoginService } from 'src/app/services/login.service';
import { RegistroService } from 'src/app/services/registro.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenService } from 'src/app/services/token.service';
import { MY_FORMATS } from '../tarjeta/tarjeta.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { CategoriaIngresoService } from 'src/app/services/categoria-ingreso.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-balance-page',
  templateUrl: './balance-page.component.html',
  styleUrl: './balance-page.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})

export class BalancePageComponent {
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  formGroup: FormGroup;
  title = 'Balance';
  showFiller = false;
  isAdmin: boolean = false;
  userName = "";
  emptyResults: boolean = false;

  loginUsuario: Usuario = {
    Login: '',
    Password: '',
    IdSistema: 3
  };

  isLogged: boolean = false;
  isLoginFail = false;
  perfil: string = "";
  errMsj: string = "";

  dataSource: any;  
  nombreColumnas: string[] = ["Registros"];
  fechaActual: any;
  periodo = new FormControl(moment());
  anio = new FormControl();
  fechaPeriodo = new FormControl();
  listaRegistros: Registro[] = [];
  listaIngresos: Ingreso[] = [];
  listaCategoriaGasto: CategoriaGasto[] = [];
  listaCategoriaIngreso: CategoriaIngreso[] = [];

  constructor(private formBuilder: FormBuilder, private loginService: LoginService, private route: Router, private tokenService: TokenService,
    private spinnerService: SpinnerService, public dialogoConfirmacion: MatDialog, public dialog: MatDialog, private registroService: RegistroService,
    private categoriaGasto: CategoriaGastoService, private categoriaIngreso: CategoriaIngresoService, private liveAnnouncer: LiveAnnouncer,
    private ingresoService: IngresoService, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {
      this._locale = 'fr';
      this.dateAdapter.setLocale(this._locale);
      this.formGroup = this.formBuilder.group({
        periodo: ['', [Validators.required]]
      })
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      this.isAdmin = (this.tokenService.getToken() != null) ? true : false;
      this.userName = this.tokenService.getUserName();
      this.fechaActual = new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2);
      //this.fechaActual = "2022"
      this.getIngresos(this.fechaActual);
      this.getRegistros(this.fechaActual);
      this.getCategoriaGastos();
      this.getCategoriaIngresos();
  }

  ngOnChanges() {   
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonthAndYear.month() + 1;
    const year = normalizedMonthAndYear.year();
    var monthWithZero = month < 9 ? "0" + month : month;
    let datePeriodo = year + "-" + monthWithZero;

    this.getRegistros(datePeriodo);
    this.getIngresos(datePeriodo);

    const ctrlValue = this.periodo.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.periodo.setValue(ctrlValue);

    datepicker.close();  
    this.emptyResults = this.listaRegistros.length == 0 && this.listaIngresos.length == 0;
    console.log(this.emptyResults)  
  }

  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    // const ctrlValue = this.anio.value;
    // ctrlValue.year(normalizedYear.year());
    // this.anio.setValue(ctrlValue);
    // datepicker.close();
    // console.log(this.anio.value, ctrlValue);

    const year = normalizedYear.year();
    let datePeriodo = year;
    console.log(datePeriodo.toString())
 
    this.anio = new FormControl(datePeriodo.toString());
    this.getRegistros(datePeriodo.toString());
    this.getIngresos(datePeriodo.toString());

    datepicker.close();
    this.emptyResults = this.listaRegistros.length == 0 && this.listaIngresos.length == 0;
    console.log(this.emptyResults)
  }

  getRegistros(periodo: string) {
    let idUsuario: number = 1;
    //let periodo: string = "2022-12";

    this.registroService.GetAll(idUsuario, periodo).subscribe((rta: any[]) => {
      this.listaRegistros = rta;
      console.log(rta);
      this.dataSource = new MatTableDataSource<any[]>(rta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  getIngresos(periodo: string) {
    let idUsuario: number = 1;
    //let periodo: string = "2022-12";

    this.ingresoService.GetAll(idUsuario, periodo).subscribe((rta: any[]) => {
      this.listaIngresos = rta;
      console.log(rta);
    });
  }

  getCategoriaGastos(){
    this.categoriaGasto.GetAll().subscribe((rta: CategoriaGasto[]) => {
      this.listaCategoriaGasto = rta;
    });
  }
  
  getCategoriaIngresos(){
    this.categoriaIngreso.GetAll().subscribe((rta: CategoriaIngreso[]) => {
      this.listaCategoriaIngreso = rta;
    });
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
