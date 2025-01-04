import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Banco } from 'src/app/models/banco';
import { TipoTarjeta } from 'src/app/models/tipo-tarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { NombreService } from 'src/app/services/nombre.service';
import { ObjetoNombre } from 'src/app/models/objeto-nombre';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { default as _rollupMoment, Moment } from 'moment';
import { FORMAT_DATE } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-abm-tarjeta',
  templateUrl: './abm-tarjeta.component.html',
  styleUrls: ['./abm-tarjeta.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TarjetaComponent {
  dataSource: any;
  nombreColumnas: string[] = ["nombre", "acciones"];
  formGroup: FormGroup;
  title = "Nueva Tarjeta";
  idTarjeta: number = 0;
  listaBancos: Banco[] = [];
  listaTiposTarjeta: TipoTarjeta[] = [];
  vencimientoSelected: boolean = false;

  datos: Tarjeta = {
    id: 0,
    numero: '',
    vencimiento: '',
    idBanco: undefined,
    idTipoTarjeta: undefined,
    idUsuario: undefined,
    habilitado: true
  };

  date = new FormControl(moment());

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private dateAdapter: DateAdapter<Date>, public datePipe: DatePipe, private route: ActivatedRoute,
    private tarjetaService: TarjetaService, private nombreService: NombreService, private tokenService: TokenService,
    private router: Router, public spinnerService: SpinnerService, @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {

    console.log(data)
    this._locale = 'fr';
    this.dateAdapter.setLocale(this._locale);
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: 0,
      numero: ['', [Validators.required]],
      vencimiento: [moment(), [Validators.required]],
      banco: ['', [Validators.required]],
      tipotarjeta: ['', [Validators.required]],
      habilitado: [true,],
      idUsuario: userId
    })
  }

  ngOnInit(): void {
    this.listarBancos();
    this.listarTiposTarjeta();
    this.route.queryParams.subscribe(params => {
      this.idTarjeta = Number(params['idTarjeta']) || 0;
    });
    if (this.idTarjeta > 0) {
      this.tarjetaService.GetById(this.idTarjeta).subscribe((rta: any) => {

        if (rta.id > 0) {
          this.title = "Editar Tarjeta";
          this.datos = {
            id: rta.id,
            numero: rta.numero,
            vencimiento: rta.vencimiento,
            idBanco: rta.banco,
            idTipoTarjeta: rta.tipotarjeta,
            habilitado: rta.habilitado,
            idUsuario: rta.idUsuario
          }
        }

      });
    }
    else {
      this.title = "Nueva Tarjeta";
    }
  }

  listarBancos() {
    this.nombreService.GetAll("banco").subscribe((rta: ObjetoNombre[]) => {
      this.listaBancos = rta;
    });
  }

  listarTiposTarjeta() {
    this.nombreService.GetAll("tipoTarjeta").subscribe((rta: ObjetoNombre[]) => {
      this.listaTiposTarjeta = rta;
    });
  }


  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };

    if (!this.vencimientoSelected) { this.setMonthAndYear(this.datos.vencimiento, undefined) }

    let _edit: Tarjeta = {
      id: this.datos.id,
      numero: this.datos.numero,
      vencimiento: this.datos.vencimiento,
      idBanco: this.datos.idBanco,
      idTipoTarjeta: this.datos.idTipoTarjeta,
      habilitado: this.datos.habilitado,
      idUsuario: this.datos.idUsuario
    };

    console.log(_edit);
    if (this.datos.id > 0) {
      this.tarjetaService.actualizar(_edit).subscribe(result => {
        this.dialogoConfirmacion.open(DialogComponent, {
          width: '400px', data: {
            titulo: "Confirmación",
            mensaje: "Tarjeta actualizada con éxito",
            icono: "check_circle",
            clase: "class-success"
          }
        });
      },
        error => {
          if (error.status == 401 || error.status == 403) {
            error.error = "Usuario no autorizado";
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: error.error,
              icono: "warning",
              clase: "class-error"
            }
          })
          console.log(error);
        }
      );
    }
    else {

      this.tarjetaService.nuevo(_edit).subscribe(result => {
        this.dialogoConfirmacion.open(DialogComponent, {
          data: {
            titulo: "Confirmación",
            mensaje: "Tarjeta ingresada con éxito",
            icono: "check_circle",
            clase: "class-success"
          },
        }).close();
      },
        error => {
          if (error.status == 401 || error.status == 403) {
            error.error = "Usuario no autorizado";
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: error.error,
              icono: "warning",
              clase: "class-error"
            }
          })
          console.log(error);
        }
      );
    }
  }

  cancel() {
    console.log("Cerrar modal")
    //this.router.navigate(['tarjetas']);
  }

  openDialog(tipo: string): void {
    switch (tipo) {
      case 'banco':
        this.openABMBanco();
        break;
      case 'tipotarjeta':
        this.openABMTiposTarjeta();
        break;
      default:
        break;
    }
  }


  openABMBanco() {
    const dialogRef = this.dialogoConfirmacion.open(TarjetaComponent, {
      width: '640px', minWidth: '340px', disableClose: false, data: {
        title: "Nuevo Banco",
        acto: null
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.listarBancos();
    })
  }

  openABMTiposTarjeta() {
    const dialogRef = this.dialogoConfirmacion.open(TarjetaComponent, {
      width: '640px', minWidth: '340px', disableClose: false, data: {
        title: "Nuevo Tipo de Tarjeta",
        acto: null
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      this.listarTiposTarjeta();
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker?: MatDatepicker<Moment>) {
    const month = normalizedMonthAndYear.month() + 1;
    const year = normalizedMonthAndYear.year();
    var _month = month < 9 ? "0" + month : month;
    this.datos.vencimiento = _month + "/" + year.toString().substring(year.toString().length, 2);

    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    console.log(ctrlValue);
    console.log(this.datos.vencimiento);

    this.vencimientoSelected = true;
    if (datepicker) { datepicker.close() }
  }
}
