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
import { RegistroVinculado } from 'src/app/models/registro-vinculado';
import { RegistroVinculadoService } from 'src/app/services/registrovinculado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { CategoriaGastoService } from 'src/app/services/categoria-gasto.service';
import { EmpresaService } from 'src/app/services/empresa.service';

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
    private dateAdapter: DateAdapter<Date>, private registroVinculadoService: RegistroVinculadoService, private _snackBar: MatSnackBar,
    private categoriaGastoService: CategoriaGastoService, private empresaService: EmpresaService, private cuentaService: CuentaService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    let userId = this.tokenService.getUserId() || 0;

    this.formGroup = this.formBuilder.group({
      id: data?.id ?? 0,
      idUsuario: userId,
      descripcion: [data?.descripcion ?? '', [Validators.required]],
      fecha: [data?.registros[0]?.fechaDesde ?? moment().format("YYYY-MM-DD[T]HH:mm:ss"), [Validators.required]],
      idCategoriaGasto: [data?.registros[0]?.idCategoriaGasto ?? '', [Validators.required]],
      idCuenta: [data?.registros[0]?.idCuenta ?? undefined,],
      idEmpresa: [data?.registros[0]?.idEmpresa ?? undefined,],
      cuotas: [data?.cuotas ?? 1, [Validators.required, Validators.min(1)]],
      valorFinal: [data?.valorFinal ?? '', [Validators.required]],
      proximoMes: [false,]
    })

    this.dateAdapter.setLocale('es-AR'); //dd/MM/yyyy
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    if (this.listEmptyOrUndefined(this.listaCategoriasGasto)) this.getCategoriaGastos();
    if (this.listEmptyOrUndefined(this.listaEmpresas)) this.getEmpresas();
    if (this.listEmptyOrUndefined(this.listaCuentas)) this.getCuentas();
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    this.datos.fecha = formatDate(this.datos.fecha, 'yyyy-MM-dd', 'en');
    this.formGroup.value.fecha = formatDate(this.formGroup.value.fecha, 'yyyy-MM-dd', 'en');

    console.log(this.datos)
    if (this.datos.id > 0) {
      this.registroVinculadoService.Update(this.datos).subscribe(data => {
          this._snackBar.open("Gasto actualizado correctamente", "Cerrar");
          setTimeout(() => { window.location.reload(); }, 2000);
      });
    } else {
      this.registroVinculadoService.Insert(this.datos).subscribe(data => {
          this._snackBar.open("Gasto registrado correctamente", "Cerrar");
          setTimeout(() => { window.location.reload(); }, 2000);
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
