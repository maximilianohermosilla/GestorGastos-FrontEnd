import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { TarjetaComponent } from '../abm-tarjeta/abm-tarjeta.component';
import { Registro } from 'src/app/models/registro';
import { Empresa } from 'src/app/models/empresa';
import { Suscripcion } from 'src/app/models/suscripcion';
import { Cuenta } from 'src/app/models/cuenta';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';
import { formatDate } from '@angular/common';
import { RegistroService } from 'src/app/services/registro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-abm-registro',
  templateUrl: './abm-registro.component.html',
  styleUrl: './abm-registro.component.css',
  //providers: [{provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}, provideNativeDateAdapter()],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE_DDMMYYYY },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AbmRegistroComponent {
  @Input() listaEmpresas: Empresa[] = [];
  @Input() listaSuscripciones: Suscripcion[] = [];
  @Input() listaCuentas: Cuenta[] = [];
  @Input() listaCategoriasGasto: CategoriaGasto[] = [];

  dataSource: any;
  formGroup: FormGroup;
  title = "Nuevo Gasto";

  datos!: Registro;
  date = new FormControl(moment());

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private registroService: RegistroService, private _snackBar: MatSnackBar) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: 0,
      idUsuario: userId,
      descripcion: ['', [Validators.required]],
      fecha: [moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: ['', [Validators.required]],
      idCuenta: [undefined,],
      idEmpresa: [undefined,],
      idRegistroVinculado: [undefined,],
      numeroCuota: [undefined,],
      valor: ['', [Validators.required]],
      observaciones: ['',],
      pagado: [false,],
      periodo: ['',],
      fechaPago: [undefined,]
    })

    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
  }

  save() {
    console.log(this.formGroup.value.fecha)
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');
    this.datos.periodo = this.datos.fecha.substring(0, 7);

    if (this.datos.id > 0) {
      //this.registroService.Insert(this.datos).subscribe( data => console.log(data));      
    } else {
      this.registroService.Insert(this.datos).subscribe(data => {
        if (data.id && data.id > 0) {
          this._snackBar.open("Gasto registrado correctamente", "Cerrar");
        }
      });
    }

    this.datos.fecha = moment(this.datos.fecha).format("YYYY-MM-DD[T]HH:mm:ss");
  }

  openABMBanco() {
    const dialogRef = this.dialogoConfirmacion.open(TarjetaComponent, {
      width: '640px', minWidth: '340px', disableClose: false, data: {
        title: "Nuevo Banco",
        acto: null
      }
    });

    dialogRef.afterClosed().subscribe(res => {
    })
  }
}
