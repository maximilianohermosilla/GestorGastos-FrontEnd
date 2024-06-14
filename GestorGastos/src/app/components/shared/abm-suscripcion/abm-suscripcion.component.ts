import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Empresa } from 'src/app/models/empresa';
import { Cuenta } from 'src/app/models/cuenta';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { formatDate } from '@angular/common';
import { Suscripcion } from 'src/app/models/suscripcion';
import { SuscripcionService } from 'src/app/services/suscripcion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-abm-suscripcion',
  templateUrl: './abm-suscripcion.component.html',
  styleUrl: './abm-suscripcion.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE_DDMMYYYY },
  ],
})
export class AbmSuscripcionComponent {
  @Input() listaEmpresas: Empresa[] = [];
  @Input() listaCuentas: Cuenta[] = [];
  @Input() listaCategoriasGasto: CategoriaGasto[] = [];

  dataSource: any;
  formGroup: FormGroup;
  title = "Nueva Suscripción";

  datos!: Suscripcion;
  date = new FormControl(moment());

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private suscripcionService: SuscripcionService, private _snackBar: MatSnackBar) {
    
    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: 0,
      idUsuario: userId,
      nombre: ['', [Validators.required]],
      fechaDesde: [moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      fechaHasta: [moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: ['', [Validators.required]],
      idCuenta: [undefined,],
      idEmpresa: [undefined,],      
      valorActual: ['', [Validators.required]],
      fechaUpdate: [moment().format("YYYY-MM-DD[T]HH:mm:ss"), ],
      proximoMes: [false,]
    })
    
    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
  }

  save() {
    console.log(this.formGroup.value.fecha)
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fechaDesde = formatDate(this.datos.fechaDesde, 'yyyy-MM-dd', 'en');
    this.datos.fechaHasta = formatDate(this.datos.fechaHasta, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fechaDesde = formatDate(this.formGroup.value.fechaDesde, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fechaHasta = formatDate(this.formGroup.value.fechaHasta, 'yyyy-MM-dd', 'en');
    
    if (this.datos.id > 0) {
      //this.registroService.Insert(this.datos).subscribe( data => console.log(data));      
    }else{
      this.suscripcionService.Insert(this.datos).subscribe( data => {
        if(data.id && data.id > 0){
          this._snackBar.open("Suscripción registrada correctamente", "Cerrar");
        }
      });
    }
    
    this.datos.fechaDesde = moment(this.datos.fechaDesde).format("YYYY-MM-DD[T]HH:mm:ss");
    this.datos.fechaHasta = moment(this.datos.fechaHasta).format("YYYY-MM-DD[T]HH:mm:ss");
  }
}
