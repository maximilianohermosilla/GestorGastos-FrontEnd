import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Ingreso } from 'src/app/models/ingreso';
import { Registro } from 'src/app/models/registro';
import { Usuario } from 'src/app/models/usuario';
import { IngresoService } from 'src/app/services/ingreso.service';
import { RegistroService } from 'src/app/services/registro.service';
import { TokenService } from 'src/app/services/token.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { FORMAT_DATE } from 'src/app/models/format-date';
import { MatDialog } from '@angular/material/dialog';
import { AbmRegistroComponent } from 'src/app/components/abm-registro/abm-registro.component';
import { AbmIngresoComponent } from 'src/app/components/abm-ingreso/abm-ingreso.component';

@Component({
  selector: 'app-reportes-page',
  templateUrl: './reportes-page.component.html',
  styleUrl: './reportes-page.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE },
  ]
})

export class ReportesPageComponent {
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();

  formGroup: FormGroup;
  periodo = new FormControl(moment());
  anio = new FormControl();

  title = 'Reportes';
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

  listaRegistros: Registro[] = [];
  listaIngresos: Ingreso[] = [];
  listaCategoriaGasto: CategoriaGasto[] = [];
  listaCategoriaIngreso: CategoriaIngreso[] = [];

  constructor(private formBuilder: FormBuilder, private tokenService: TokenService, private registroService: RegistroService,
    public dialog: MatDialog, private cdr: ChangeDetectorRef, private ingresoService: IngresoService, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {
      this._locale = 'fr';
      this.dateAdapter.setLocale(this._locale);
      this.formGroup = this.formBuilder.group({
        periodo: ['', [Validators.required]]
      })
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
      this.isAdmin = (this.tokenService.getToken() != null) ? true : false;
      this.userName = this.tokenService.getUserName();
      this.fechaPeriodo = new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2);
      this.getIngresos(this.fechaPeriodo);
      this.getRegistros(this.fechaPeriodo);
  }

  
  getPeriodo(periodo: string){
    this.fechaPeriodo = periodo;
    this.getRegistros(periodo);
    this.getIngresos(periodo);
  }

  getRegistros(periodo: string) {
    let idUsuario: number = 1;

    this.registroService.GetAll(idUsuario, periodo).subscribe((rta: any[]) => {
      this.listaRegistros = rta;
    });
  }

  getIngresos(periodo: string) {
    let idUsuario: number = 1;

    this.ingresoService.GetAll(idUsuario, periodo).subscribe((rta: any[]) => {
      this.listaIngresos = rta;
    });
  }

  addRegistro() {
    const dialogRef = this.dialog.open(AbmRegistroComponent, {
      width: "99vw",
      minWidth: "50vw",
      maxHeight: '80vh',
      disableClose: false,
      data: undefined
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }
  
  addIngreso() {
    const dialogRef = this.dialog.open(AbmIngresoComponent, {
      width: "99vw",
      minWidth: "50vw",
      maxHeight: '80vh',
      disableClose: false,
      data: undefined
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }
}
