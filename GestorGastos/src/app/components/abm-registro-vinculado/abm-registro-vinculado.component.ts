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
import { RegistroVinculado } from 'src/app/models/registro-vinculado';
import { RegistroVinculadoService } from 'src/app/services/registrovinculado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-abm-registro-vinculado',
  templateUrl: './abm-registro-vinculado.component.html',
  styleUrl: './abm-registro-vinculado.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE_DDMMYYYY },
  ],
})
export class AbmRegistroVinculadoComponent {
  @Input() listaEmpresas: Empresa[] = [];
  @Input() listaCuentas: Cuenta[] = [];
  @Input() listaCategoriasGasto: CategoriaGasto[] = [];

  dataSource: any;
  formGroup: FormGroup;
  title = "Nuevo gasto en cuotas";

  datos!: RegistroVinculado;
  date = new FormControl(moment());

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private registroVinculadoService: RegistroVinculadoService, private _snackBar: MatSnackBar) {
    
    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: 0,
      idUsuario: userId,
      descripcion: ['', [Validators.required]],
      fecha: [moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: ['', [Validators.required]],
      idCuenta: [undefined,],
      idEmpresa: [undefined,],
      cuotas: [1, [Validators.required, Validators.min(1)]],
      valorFinal: ['', [Validators.required]],
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
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');    
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');    

    if (this.datos.id > 0) {
      //this.registroService.Insert(this.datos).subscribe( data => console.log(data));      
    }else{
      this.registroVinculadoService.Insert(this.datos).subscribe( data => {
        if(data.id && data.id > 0){
          this._snackBar.open("Gasto registrado correctamente", "Cerrar");
        }
      });
    }

    this.datos.fecha = moment(this.datos.fecha).format("YYYY-MM-DD[T]HH:mm:ss");
  }
}
