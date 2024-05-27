import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatCalendarCellClassFunction, MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner.service';
import { Banco } from 'src/app/models/banco';
import { TipoTarjeta } from 'src/app/models/tipoTarjeta';
import { Tarjeta } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { NombreService } from 'src/app/services/nombre.service';
import { ObjetoNombre } from 'src/app/models/objeto-nombre';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';


const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    //{provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
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

  date = new FormControl(moment());

  datos: Tarjeta = {
    id: 0,
    numero: '',
    vencimiento: '',
    idBanco: undefined,
    idTipoTarjeta: undefined,
    idUsuario: undefined,
    habilitado: false
  };

  // dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
  //   // Only highligh dates inside the month view.
  //   if (view === 'month') {
  //     const date = cellDate.getDate();

  //     // Highlight the 1st and 20th day of each month.
  //     return date === 1 || date === 20 ? 'example-custom-date-class' : '';
  //   }

  //   return '';
  // };

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private dateAdapter: DateAdapter<Date>, public datePipe: DatePipe, private route: ActivatedRoute,
    private tarjetaService: TarjetaService, private nombreService: NombreService,
    private router: Router, public spinnerService: SpinnerService,
      @Inject(MAT_DATE_LOCALE) private _locale: string){
      this._locale = 'fr';
      this.dateAdapter.setLocale(this._locale);
      this.formGroup = this.formBuilder.group({
        numero: ['',[Validators.required]],      
        vencimiento: [moment(),[Validators.required]],
        banco: ['',[Validators.required]],
        tipotarjeta: ['',[Validators.required]],
        habilitado: ['',]
      })
      this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

  }
  ngOnInit(): void {
    this.listarBancos();
    this.listarTiposTarjeta();
    this.route.queryParams.subscribe(params => {
      this.idTarjeta = Number(params['idTarjeta']) || 0;
    });
    if (this.idTarjeta > 0){
      this.tarjetaService.GetById(this.idTarjeta).subscribe((rta: any) => {
        
        if(rta.id > 0){
          this.title = "Editar Tarjeta";
          this.datos.id = rta.id;
          this.datos.numero = rta.numero;
          this.datos.vencimiento = rta.vencimiento,
          this.datos.idBanco = rta.banco;
          this.datos.idTipoTarjeta = rta.tipotarjeta;
          this.datos.habilitado = rta.habilitado;
        }
        
      });
    }
    else{
      this.title = "Nueva Tarjeta";
    }
  }

  listarBancos(){
    this.nombreService.GetAll("banco").subscribe((rta: ObjetoNombre[]) => {
      this.listaBancos = rta;    
    });
  }

  listarTiposTarjeta(){
    this.nombreService.GetAll("tipoTarjeta").subscribe((rta: ObjetoNombre[]) => {
      this.listaTiposTarjeta = rta;  
    });
  }


  save(){
    let currentDate = new Date();
    const currentDateFormatted = this.datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(currentDateFormatted);
    let _edit: Tarjeta = {
      id: this.datos.id,
      numero: this.datos.numero,
      vencimiento: this.datos.vencimiento,
      idBanco: this.datos.idBanco,
      idTipoTarjeta: this.datos.idTipoTarjeta,
      habilitado: this.datos.habilitado
    };
    console.log(_edit);
    if (this.datos.id > 0){

      this.tarjetaService.actualizar(_edit).subscribe(result =>
        {         
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
          if (error.status == 401 || error.status == 403){
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
    else{   
      
      this.tarjetaService.nuevo(_edit).subscribe(result =>
        {
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "Tarjeta ingresada con éxito",
              icono: "check_circle",
              clase: "class-success"
            }
          });
        },
        error => {
          if (error.status == 401 || error.status == 403){
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

  cancel(){
    this.router.navigate(['tarjetas']);
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


  openABMBanco(){
    const dialogRef = this.dialogoConfirmacion.open( TarjetaComponent,{
      width: '640px', minWidth: '340px',disableClose: false, data: {
        title: "Nuevo Banco",
        acto: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      this.listarBancos();
    })
  }

  openABMTiposTarjeta(){
    const dialogRef = this.dialogoConfirmacion.open(TarjetaComponent,{
      width: '640px', minWidth: '340px',disableClose: false, data: {
        title: "Nuevo Tipo de Tarjeta",
        acto: null
      } 
    });

    dialogRef.afterClosed().subscribe( res => {
      this.listarTiposTarjeta();
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonthAndYear.month() + 1;
    const year = normalizedMonthAndYear.year();
    var _month = month < 9? "0" + month: month;
    this.datos.vencimiento = _month + "/" + year;

    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    console.log(ctrlValue);
    console.log(this.datos.vencimiento);

    datepicker.close();
  }
}
