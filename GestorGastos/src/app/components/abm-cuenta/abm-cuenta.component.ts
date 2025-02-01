import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FORMAT_DATE_DDMMYYYY } from 'src/app/models/format-date';
import { TokenService } from 'src/app/services/token.service';
import { TipoCuentaService } from 'src/app/services/tipocuenta.service';
import { TipoCuenta } from 'src/app/models/tipo-cuenta';
import { Cuenta } from 'src/app/models/cuenta';
import { TarjetaComponent } from '../abm-tarjeta/abm-tarjeta.component';
import { Tarjeta } from 'src/app/models/tarjeta';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { CuentaService } from 'src/app/services/cuenta.service';

@Component({
  selector: 'app-abm-cuenta',
  templateUrl: './abm-cuenta.component.html',
  styleUrl: './abm-cuenta.component.css'
})
export class AbmCuentaComponent {
  dataSource: any;
  listaTipoCuenta: TipoCuenta[] = [];
  listaTarjetas: Tarjeta[] = [];
  formGroup: FormGroup;
  title = "Nuevo ingreso";

  datos!: Cuenta;
  date = new FormControl(moment());

  constructor(private formBuilder: FormBuilder, public dialogoConfirmacion: MatDialog, private tokenService: TokenService,    
    private tipoCuentaService: TipoCuentaService, private tarjetaService: TarjetaService, private cuentaService: CuentaService,
    private _snackBar: MatSnackBar, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    
    let userId = this.tokenService.getUserId() || 0;
    data = data ?? {id: 0, idUsuario: userId, nombre: '', idTipoCuenta: '', idTarjeta: '', habilitado: true};

    this.formGroup = this.formBuilder.group({
      id: data.id ?? 0,
      idUsuario: userId,
      nombre: [data.nombre ?? '', [Validators.required]],
      idTipoCuenta: [data.idTipoCuenta ?? '', [Validators.required]],
      idTarjeta: [data.idTarjeta ?? undefined, ],
      habilitado: [data.habilitado ?? true, ]
    })
    
    this.datos = { ... this.datos, ...this.formGroup.value };
  }

  ngOnInit(): void {
    this.getTipoCuenta();
    this.getTarjetas();
  }

  save() {
    this.datos = { ... this.datos, ...this.formGroup.value };
    if(this.datos.idTipoCuenta == 3){ this.datos.idTarjeta = undefined; }

    if (this.datos.id > 0) {
      this.cuentaService.actualizar(this.datos).subscribe( data => console.log(data));      
    }else{
      this.cuentaService.Insert(this.datos).subscribe( data => {
        if(data.id && data.id > 0){
          this._snackBar.open("Cuenta registrada correctamente", "Cerrar");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      });
    }    
  }

  
  getTipoCuenta(){
    this.tipoCuentaService.GetAll().subscribe((rta: TipoCuenta[]) => {
      this.listaTipoCuenta = rta;
    });
  }  
  
  getTarjetas(){
    this.tarjetaService.GetAll().subscribe((rta: Tarjeta[]) => {
      this.listaTarjetas = rta;
    });
  }  

    
  openTarjetaABM(){
    const dialogRef = this.dialog.open(TarjetaComponent,{
      width: '640px',
      maxWidth: '90vw',
      disableClose: false, data: {
        title: "Ingresar",        
      } 
    });
    dialogRef.afterClosed().subscribe( res => {
      this.getTarjetas()
    })
  }
}
