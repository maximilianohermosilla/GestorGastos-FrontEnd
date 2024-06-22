import { Component } from '@angular/core';
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
  listaTarjetas: any[] = [];

  constructor(private usuarioService: UsuarioService, private bancoService: BancoService, private tipoCuentaService: TipoCuentaService,
    private tipoTarjetaService: TipoTarjetaService, private cuentaService: CuentaService, private tarjetaService: TarjetaService
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
      console.log(this.listaTarjetas)
    });
  }

  getCuentas() {
    this.cuentaService.GetAll().subscribe((response: any) => {
      this.listaCuentas = response;
      console.log(this.listaCuentas)
    });
  }

  getTipoTarjetas() {
    this.tipoTarjetaService.GetAll().subscribe((response: any) => {
      this.listaTipoTarjetas = response;
      //console.log(this.listaTipoTarjetas)
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
      console.log(response)
    });
  }

}
