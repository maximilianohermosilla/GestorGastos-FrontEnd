import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { FORMAT_DATE } from 'src/app/models/format-date';
import { DatePipe } from '@angular/common';
import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { NombreService } from 'src/app/services/nombre.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TarjetaComponent } from '../../tarjeta/tarjeta.component';
import { Registro } from 'src/app/models/registro';
import { Empresa } from 'src/app/models/empresa';
import { Suscripcion } from 'src/app/models/suscripcion';
import { Cuenta } from 'src/app/models/cuenta';
import { CategoriaGasto } from 'src/app/models/categoria-gasto';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-abm-registro',
  templateUrl: './abm-registro.component.html',
  styleUrl: './abm-registro.component.css',
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
export class AbmRegistroComponent {
  @Input() listaEmpresas: Empresa[] = [];
  @Input() listaSuscripciones: Suscripcion[] = [];
  @Input() listaCuentas: Cuenta[] = [];
  @Input() listaCategoriasGasto: CategoriaGasto[] = [];

  dataSource: any;
  formGroup: FormGroup;
  title = "Agregar Gasto";

  date = new FormControl(moment());

  datos: Registro = {
    id: 0,
    descripcion: '',
    idEmpresa: 0,
    idCategoriaGasto: 0,
    idCuenta: 0,
    idRegistroVinculado: 0,
    numeroCuota: 0,
    fecha: '',
    valor: 0,
    idUsuario: 0,
    observaciones: '',
    pagado: false,
    fechaPago: ''
  };

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private dateAdapter: DateAdapter<Date>, public datePipe: DatePipe, private route: ActivatedRoute,
    private tarjetaService: TarjetaService, private nombreService: NombreService,
    private router: Router, public spinnerService: SpinnerService,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {
    this._locale = 'fr';
    this.dateAdapter.setLocale(this._locale);
    this.formGroup = this.formBuilder.group({
      descripcion: ['', [Validators.required]],
      fecha: [moment(), [Validators.required]],
      idEmpresa: ['', [Validators.required]],
      //idCategoriaGasto: ['', [Validators.required]],
      idCuenta: ['', ],
      valor: ['',[Validators.required]],
      observaciones: ['',],
      pagado: ['',]
    })
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

  }
  ngOnInit(): void {
  }

  save() {
    let currentDate = new Date();
    const currentDateFormatted = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(currentDateFormatted);
    if (this.datos.id > 0) {

      // this.tarjetaService.actualizar(_edit).subscribe(result =>
      //   {         
      //     this.dialogoConfirmacion.open(DialogComponent, {
      //       width: '400px', data: {
      //         titulo: "Confirmación",
      //         mensaje: "Tarjeta actualizada con éxito",
      //         icono: "check_circle",
      //         clase: "class-success"
      //       }
      //     });          
      //   },
      //   error => {    
      //     if (error.status == 401 || error.status == 403){
      //       error.error = "Usuario no autorizado";
      //     }      
      //     this.dialogoConfirmacion.open(DialogComponent, {
      //       data: {
      //         titulo: "Error",
      //         mensaje: error.error,
      //         icono: "warning",
      //         clase: "class-error"
      //       }
      //     })
      //     console.log(error);
      //   }
      // );
    }
  }

  // openDialog(tipo: string): void {
  //   switch (tipo) {
  //     case 'banco':
  //       this.openABMBanco();
  //       break;
  //     case 'tipotarjeta':
  //       this.openABMTiposTarjeta();
  //       break;
  //     default:
  //       break;
  //   }
  // }


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

  openABMTiposTarjeta() {
    const dialogRef = this.dialogoConfirmacion.open(TarjetaComponent, {
      width: '640px', minWidth: '340px', disableClose: false, data: {
        title: "Nuevo Tipo de Tarjeta",
        acto: null
      }
    });

    dialogRef.afterClosed().subscribe(res => {
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonthAndYear.month() + 1;
    const year = normalizedMonthAndYear.year();
    var _month = month < 9 ? "0" + month : month;
    this.datos.fecha = _month + "/" + year;

    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    console.log(ctrlValue);
    console.log(this.datos.fecha);

    datepicker.close();
  }
}
