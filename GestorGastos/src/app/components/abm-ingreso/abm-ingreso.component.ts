import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Inject, Input, Optional } from '@angular/core';
import { CategoriaIngreso } from 'src/app/models/categoria-ingreso';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ingreso } from 'src/app/models/ingreso';
import { IngresoService } from 'src/app/services/ingreso.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CategoriaIngresoService } from 'src/app/services/categoria-ingreso.service';

@Component({
  selector: 'app-abm-ingreso',
  templateUrl: './abm-ingreso.component.html',
  styleUrl: './abm-ingreso.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE_DDMMYYYY },
  ],
})

export class AbmIngresoComponent {
  @Input() listaCategoriaIngreso: CategoriaIngreso[] = [];

  dataSource: any;
  formGroup: FormGroup;
  title = "Nuevo ingreso";

  datos!: Ingreso;
  date = new FormControl(moment());
  permiteEliminar: boolean = false;

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,
    private dateAdapter: DateAdapter<Date>, private ingresoService: IngresoService, private _snackBar: MatSnackBar,
    private categoriaIngresoService: CategoriaIngresoService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: data?.id ?? 0,
      idUsuario: data?.idUsuario ?? userId,
      descripcion: [data?.descripcion ?? '', [Validators.required]],
      fecha: [data?.fecha ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaIngreso: [data?.idCategoriaIngreso ?? '', [Validators.required]],
      valor: [data?.valor ??'', [Validators.required]],
      periodo: [data?.periodo ?? '',]
    })

    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    if(this.listaCategoriaIngreso == undefined || this.listaCategoriaIngreso.length == 0){
      this.getCategoriasIngresos();
    }
    this.permiteEliminar = this.data != null && this.data!.id > 0;
  }
  
  getCategoriasIngresos() {
    this.categoriaIngresoService.GetAll().subscribe((rta: CategoriaIngreso[]) => {
      this.listaCategoriaIngreso = rta;
    });
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');
    this.datos.periodo = this.datos.fecha.substring(0, 7);

    if (this.datos.id > 0) {
      this.ingresoService.Update(this.datos).subscribe(data => {
        console.log(data);
        this._snackBar.open("Ingreso actualizado correctamente", "Cerrar");
        setTimeout(() => {
          window.location.reload()
        }, 2000);
    });
    } else {
      this.ingresoService.Insert(this.datos).subscribe(data => {
        if (data.id && data.id > 0) {
          this._snackBar.open("Ingreso registrado correctamente", "Cerrar");
          setTimeout(() => {
            window.location.reload()
          }, 2000);
        }
      });
    }

    this.datos.fecha = moment(this.datos.fecha).format("YYYY-MM-DD[T]HH:mm:ss");
  }
  
  delete() {
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
      data: `¿Está seguro de eliminar este registro?`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.ingresoService.eliminarById(this.data.id).subscribe(data => {
            this._snackBar.open("Ingreso eliminado correctamente", "Cerrar");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          });
        }
      });
  }

}
