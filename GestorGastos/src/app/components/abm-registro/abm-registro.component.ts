import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Inject, Input, Optional, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { CuentaService } from 'src/app/services/cuenta.service';

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
    private dateAdapter: DateAdapter<Date>, private registroService: RegistroService, private _snackBar: MatSnackBar,
    private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: data?.id ?? 0,
      idUsuario: userId,
      descripcion: [data?.descripcion ?? '', [Validators.required]],
      fecha: [data?.fecha ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: [data?.idCategoriaGasto ?? '', [Validators.required]],
      idCuenta: [data?.idCuenta ?? undefined,],
      idEmpresa: [data?.idEmpresa ?? undefined,],
      idRegistroVinculado: [data?.idRegistroVinculado ?? undefined,],
      numeroCuota: [data?.numeroCuota ?? undefined,],
      valor: [data?.valor ?? '', [Validators.required]],
      observaciones: [data?.observaciones ?? '',],
      pagado: [data?.pagado ?? false,],
      periodo: [data?.periodo ?? '',],
      fechaPago: [data?.fechaPago ??  formatDate(new Date(), 'yyyy-MM-dd', 'en'),]
    })

    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.listEmptyOrUndefined(this.listaCategoriasGasto)) this.getCategoriaGastos();
      if (this.listEmptyOrUndefined(this.listaEmpresas)) this.getEmpresas();
      if (this.listEmptyOrUndefined(this.listaCuentas)) this.getCuentas();
      console.log(this.data)
    }, 100);
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');
    this.datos.periodo = this.datos.fecha.substring(0, 7);
    if (this.data) this.datos!.id = this.data.id ?? 0;

    console.log(this.datos)
    if (this.datos.id > 0) {
      this.registroService.Update(this.datos).subscribe(data => {
        console.log(data)
        if (data.id && data.id > 0) {
          this._snackBar.open("Gasto actualizado correctamente", "Cerrar");
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    } else {
      this.registroService.Insert(this.datos).subscribe(data => {
        if (data.id && data.id > 0) {
          this._snackBar.open("Gasto registrado correctamente", "Cerrar");
        }
      });
    }

    this.datos.fecha = moment(this.datos.fecha).format("YYYY-MM-DD[T]HH:mm:ss");
  }


  getCategoriaGastos() {
    this.categoriaGastoService.GetAll().subscribe((rta: CategoriaGasto[]) => {
      this.listaCategoriasGasto = rta;
      // console.log(this.listaCategoriaGasto);
    });
  }

  getEmpresas() {
    this.empresaService.GetAll().subscribe((rta: Empresa[]) => {
      this.listaEmpresas = rta;
      // console.log(this.listaEmpresas);
    });
  }

  getCuentas() {
    this.cuentaService.GetAll().subscribe((rta: Cuenta[]) => {
      this.listaCuentas = rta.filter(c => c.habilitado);
      // console.log(this.listaCuentas);
    });
  }

  listEmptyOrUndefined(lista: any[]) {
    return (lista == undefined || lista.length == 0);
  }
}
