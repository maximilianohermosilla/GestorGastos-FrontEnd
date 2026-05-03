import 'moment/locale/ja';
import 'moment/locale/fr';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, EventEmitter, Inject, Input, Optional, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RegistroAhorro } from 'src/app/models/registro-ahorro';
import { Cuenta } from 'src/app/models/cuenta';
import { formatDate } from '@angular/common';
import { RegistroAhorroService } from 'src/app/services/registroahorro.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-abm-registro-ahorro',
  templateUrl: './abm-registro-ahorro.component.html',
  styleUrl: './abm-registro-ahorro.component.css',
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
export class AbmRegistroAhorroComponent {
  @Input() listaCuentas: Cuenta[] = [];
  @Output() emitGuardarRegistro = new EventEmitter<any>();

  dataSource: any;
  formGroup: FormGroup;
  title = "Nuevo Registro de Ahorro";

  datos!: RegistroAhorro;
  date = new FormControl(moment());
  permiteEliminar: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private registroAhorroService: RegistroAhorroService, private _snackBar: MatSnackBar,
    private cuentaService: CuentaService,
    @Optional() public dialogRef: MatDialogRef<AbmRegistroAhorroComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: data?.id ?? 0,
      idUsuario: userId,
      descripcion: [data?.descripcion ?? '', [Validators.required]],
      fecha: [data?.fecha ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCuenta: [data?.idCuenta ?? undefined,],
      valor: [data?.valor ?? '', [Validators.required]],
      diferencia: [data?.diferencia ?? 0,],
      observaciones: [data?.observaciones ?? '',],
      periodo: [data?.periodo ?? '',],
    })

    this.dateAdapter.setLocale('es-AR'); 
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    if (this.listEmptyOrUndefined(this.listaCuentas)) this.getCuentas();
    this.permiteEliminar = this.data != null && this.data!.id > 0;
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');
    this.datos.periodo = this.datos.fecha.toString().substring(0, 7);
    if (this.data) this.datos!.id = this.data.id ?? 0;

    if (this.datos.id > 0) {
      this.registroAhorroService.Update(this.datos).subscribe(() => {
        this._snackBar.open("Registro de ahorro actualizado correctamente", "Cerrar", { duration: 3000 });
        this.dialogRef?.close(true);
      });
    } else {
      this.registroAhorroService.Insert(this.datos).subscribe(() => {
        this._snackBar.open("Registro de ahorro insertado correctamente", "Cerrar", { duration: 3000 });
        this.dialogRef?.close(true);
      });
    }

    this.emitGuardarRegistro.emit(this.datos);
    this.datos.fecha = moment(this.datos.fecha).format("YYYY-MM-DD[T]HH:mm:ss");
  }

  delete() {
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
      data: `¿Está seguro de eliminar este registro?`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.registroAhorroService.eliminarById(this.data.id).subscribe(() => {
            this._snackBar.open("Registro de ahorro eliminado correctamente", "Cerrar", { duration: 3000 });
            this.dialogRef?.close(true);
          });
        }
      });
  }

  getCuentas() {
    this.cuentaService.GetAll().subscribe((rta: Cuenta[]) => {
      this.listaCuentas = rta.filter(c => c.habilitado);
    });
  }

  listEmptyOrUndefined(lista: any[]) {
    return (lista == undefined || lista.length == 0);
  }
}
