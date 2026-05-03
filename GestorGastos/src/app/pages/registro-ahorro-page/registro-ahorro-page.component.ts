import { Component } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta';
import { RegistroAhorro } from 'src/app/models/registro-ahorro';
import { CuentaService } from 'src/app/services/cuenta.service';
import { RegistroAhorroService } from 'src/app/services/registroahorro.service';

@Component({
  selector: 'app-registro-ahorro-page',
  templateUrl: './registro-ahorro-page.component.html',
  styleUrl: './registro-ahorro-page.component.css'
})
export class RegistroAhorroPageComponent {
  periodo: string = "";
  listaCuentas: Cuenta[] = [];
  listaRegistros: RegistroAhorro[] = [];

  constructor(private cuentaService: CuentaService, private registroAhorroService: RegistroAhorroService) {
  }

  ngOnInit() {
    this.getCuentas();
  }

  getPeriodo(periodo: string) {
    this.periodo = periodo;
    this.getRegistros(periodo);
  }

  getRegistros(periodo: string) {
    let idUsuario: number = 1; // Service gets userId from token
    this.registroAhorroService.GetAll(idUsuario, this.periodo).subscribe((rta: any[]) => {
      this.listaRegistros = rta;
    });
  }

  getCuentas() {
    this.cuentaService.GetAll().subscribe((rta: Cuenta[]) => {
      this.listaCuentas = rta.filter(c => c.habilitado);
    });
  }
}
