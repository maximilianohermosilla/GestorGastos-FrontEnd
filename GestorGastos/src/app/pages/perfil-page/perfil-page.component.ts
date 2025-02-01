import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbmCuentaComponent } from 'src/app/components/abm-cuenta/abm-cuenta.component';
import { BancoService } from 'src/app/services/banco.service';
import { CuentaService } from 'src/app/services/cuenta.service';
import { TarjetaService } from 'src/app/services/tarjeta.service';
import { TipoCuentaService } from 'src/app/services/tipocuenta.service';
import { TipoTarjetaService } from 'src/app/services/tipotarjeta.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil-page',
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.css'
})

export class PerfilPageComponent {
  user: any;
  listaBancos: any[] = [];
  listaTipoCuentas: any[] = [];
  listaTipoTarjetas: any[] = [];
  listaCuentas: any[] = [];
  listaCuentasDeshabilitadas: any[] = [];
  listaTarjetas: any[] = [];

  constructor(private usuarioService: UsuarioService, private bancoService: BancoService, private tipoCuentaService: TipoCuentaService,
    private tipoTarjetaService: TipoTarjetaService, private cuentaService: CuentaService, private tarjetaService: TarjetaService, 
    public dialog: MatDialog, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.getUsuario();      
      this.getCuentas();
      this.getTarjetas();
      this.getTipoCuentas();
      this.getBancos();
      this.getTipoTarjetas();
    }, 0);
  }

  getTarjetas() {
    this.tarjetaService.GetAll().subscribe((response: any) => {
      this.listaTarjetas = response;
    });
  }

  getCuentas() {
    this.cuentaService.GetAll().subscribe((response: any) => {
      this.listaCuentas = response;
    });
  }

  getTipoTarjetas() {
    this.tipoTarjetaService.GetAll().subscribe((response: any) => {
      this.listaTipoTarjetas = response;
    });
  }

  getTipoCuentas() {
    this.tipoCuentaService.GetAll().subscribe((response: any) => {
      this.listaTipoCuentas = response;
      //console.log(this.listaTipoCuentas)
    });
  }

  getBancos() {
    this.bancoService.GetAll().subscribe((response: any) => {
      this.listaBancos = response;
      //console.log(this.listaBancos)
    });
  }

  getUsuario() {
    this.usuarioService.GetById().subscribe((response: any) => {
      this.user = response;
      this.user.imagen = (!this.user.imagen || this.user.imagen.length === 0) ? `..\\..\\assets\\img\\user-placeholder.png`: this.user.imagen;
    });
  }
  
  openCuenta(idCuenta?: any){
    const dialogRef = this.dialog.open(AbmCuentaComponent,{
      width: '640px',
      maxWidth: '90vw',
      disableClose: false, 
      data: idCuenta 
    });
    dialogRef.afterClosed().subscribe( res => {
        this.getCuentas();
        this.cdr.detectChanges();
      //}
    })   
  }

  getIdCuenta(idCuenta: any){
    this.openCuenta(idCuenta);
  }

  toggleCuenta(cuenta: any){
    if (cuenta.id > 0) {
      cuenta.habilitado = !cuenta.habilitado
      this.cuentaService.actualizar(cuenta).subscribe( data => console.log(data));      
    }
    //this.openCuenta(cuenta);
  }

  onCheckDeshabilitados(check: any){
    if(!check){
      this.listaCuentas = this.listaCuentas.filter(c => c.habilitado)
    }
    else{
      this.getCuentas();
    }
  }
}
