import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Inject, Input, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

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
  permiteEliminar: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private suscripcionService: SuscripcionService, private _snackBar: MatSnackBar,
    private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: data?.id ?? 0,
      idUsuario: userId,
      nombre: [data?.nombre ?? '', [Validators.required]],
      fechaDesde: [data?.fechaDesde ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      fechaHasta: [data?.fechaHasta ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: [data?.registros[0]?.idCategoriaGasto ?? undefined, [Validators.required]],
      idCuenta: [data?.registros[0]?.idCuenta ?? undefined,],
      idEmpresa: [data?.registros[0]?.idEmpresa ?? undefined,],
      valorActual: [data?.valorActual ?? '', [Validators.required]],
      fechaUpdate: [moment().format("YYYY-MM-DD[T]HH:mm:ss"),],
      proximoMes: [false,]
    })

    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    if (this.listEmptyOrUndefined(this.listaCategoriasGasto)) this.getCategoriaGastos();
    if (this.listEmptyOrUndefined(this.listaEmpresas)) this.getEmpresas();
    if (this.listEmptyOrUndefined(this.listaCuentas)) this.getCuentas();
    this.permiteEliminar = this.data != null && this.data!.id > 0;
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fechaDesde = formatDate(this.datos.fechaDesde, 'yyyy-MM-dd', 'en');
    this.datos.fechaHasta = formatDate(this.datos.fechaHasta, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fechaDesde = formatDate(this.formGroup.value.fechaDesde, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fechaHasta = formatDate(this.formGroup.value.fechaHasta, 'yyyy-MM-dd', 'en');

    if (this.datos.id > 0) {
      this.datos.fechaUpdate = this.formGroup.value.fechaDesde;
      this.suscripcionService.Update(this.datos).subscribe(data => {
        this._snackBar.open("Suscripción actualizada correctamente", "Cerrar");
        setTimeout(() => { window.location.reload(); }, 2000);
      });
    } else {
      this.suscripcionService.Insert(this.datos).subscribe(data => {
        this._snackBar.open("Suscripción registrada correctamente", "Cerrar");
        setTimeout(() => { window.location.reload(); }, 2000);
      });
    }

    this.datos.fechaDesde = moment(this.datos.fechaDesde).format("YYYY-MM-DD[T]HH:mm:ss");
    this.datos.fechaHasta = moment(this.datos.fechaHasta).format("YYYY-MM-DD[T]HH:mm:ss");
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


  delete() {
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
      data: `¿Está seguro de eliminar esta sucripción y todos sus registros?`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          console.log(confirmado);
          console.log(this.data.id)
          this.suscripcionService.eliminarById(this.data.id).subscribe(data => {
            console.log(data);
            setTimeout(() => {
              //window.location.reload();
            }, 2000);
          });
        }
      });
  }
}
