import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import { Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Ingreso } from 'src/app/models/ingreso';
import { Registro } from 'src/app/models/registro';
import { Usuario } from 'src/app/models/usuario';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { FORMAT_DATE } from 'src/app/models/format-date';
import MockRegistros from '../../../assets/mocks/registros.json';
import MockIngresos from '../../../assets/mocks/ingresos.json';

@Component({
  selector: 'app-charts-demo',
  templateUrl: './charts-demo.component.html',
  styleUrl: './charts-demo.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE },
  ]
})

export class ChartsDemoComponent {
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();

  formGroup: FormGroup;
  periodo = new FormControl(moment());
  anio = new FormControl();

  title = 'Balance';
  showFiller = false;
  isAdmin: boolean = false;
  userName = "";
  isLogged: boolean = false;
  isLoginFail = false;
  perfil: string = "";
  errMsj: string = "";

  loginUsuario: Usuario = {
    Login: '',
    Password: '',
    IdSistema: 3
  };

  dataSource: any;
  fechaPeriodo: string = "";
  fechaAnio: string = "";

  listaRegistros: any[] = [];
  listaIngresos: Ingreso[] = [];
  listaCategoriaGasto: CategoriaGasto[] = [];
  listaCategoriaIngreso: CategoriaIngreso[] = [];

  constructor(private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {
    this._locale = 'fr';
    this.dateAdapter.setLocale(this._locale);
    this.formGroup = this.formBuilder.group({
      periodo: ['', [Validators.required]]
    })
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.fechaPeriodo = new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2);
    this.getIngresos('2025-01');
    this.getRegistros('2025-01');
  }


  getPeriodo(periodo: string) {
    this.fechaPeriodo = periodo;
    this.getRegistros('2025-01');
    this.getIngresos('2025-01');
  }

  getRegistros(periodo: string) {
    this.listaRegistros = MockRegistros;

  }

  getIngresos(periodo: string) {
    this.listaIngresos = MockIngresos;
  }

}
