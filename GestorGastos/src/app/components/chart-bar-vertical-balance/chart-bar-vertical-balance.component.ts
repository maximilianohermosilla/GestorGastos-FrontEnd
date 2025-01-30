import { Component, Input } from '@angular/core';
import { Registro } from 'src/app/models/registro';

@Component({
  selector: 'app-chart-bar-vertical-balance',
  templateUrl: './chart-bar-vertical-balance.component.html',
  styleUrl: './chart-bar-vertical-balance.component.css'
})

export class ChartBarVerticalBalanceComponent {
  @Input() dataRegistros: any;
  @Input() dataIngresos: any;


  single: any[] = [];
  view: any = [340, 280];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Cuentas';
  legendPosition: any = 'below';
  legendTitle: string = "Gastos";

  colorScheme: any = {
    domain: ['#5AA454', '#ff5733', '#A10A28', '#C7B42C', '#5733ff']
  };

  constructor() {
  }


  ngOnInit(): void {
    setTimeout(() => {
      const resultado = this.agruparGastosPorCuenta(this.dataRegistros);

      resultado.sort(function (a, b) {
        return a.totalValor < b.totalValor ? 1 : a.totalValor > b.totalValor ? -1 : 0;
      });

      const mappedList: any[] = resultado.map(obj => ({
        name: obj.nombre,
        value: obj.totalValor
      }));

      //const colorArray: string[] = resultado.map(obj => obj.color);

      this.single = mappedList;
      //this.colorScheme = { domain: colorArray };

      const resultadoGastros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
        acumulador.Gasto += gasto.valor;
        return acumulador;
      }, { Gasto: 0 });

      this.legendTitle = "Gastos: $" + resultadoGastros.Gasto.toString();
    }, 500);
  }

  ngOnChanges() {
    const resultado = this.agruparGastosPorCuenta(this.dataRegistros);

    resultado.sort(function (a, b) {
      return a.totalValor < b.totalValor ? 1 : a.totalValor > b.totalValor ? -1 : 0;
    });

    const mappedList: any[] = resultado.map(obj => ({
      name: obj.nombre,
      value: obj.totalValor
    }));


    //const colorArray: string[] = resultado.map(obj => obj.color);

    this.single = mappedList;
    //this.colorScheme = { domain: colorArray };

    const resultadoGastros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
      acumulador.Gasto += gasto.valor;
      return acumulador;
    }, { Gasto: 0 });

    this.legendTitle = "Gastos: $" + resultadoGastros.Gasto.toString();
  }

  agruparGastosPorCuenta = (gastos: Registro[]): any[] => {
    const mapaGastos = new Map<string, any>();

    gastos.forEach(gasto => {
      const { nombre } = gasto.cuenta!;
      const key = `${nombre}`;

      if (mapaGastos.has(key)) {
        mapaGastos.get(key)!.totalValor += gasto.valor;
      } else {
        mapaGastos.set(key, { nombre, totalValor: gasto.valor });
      }
    });

    return Array.from(mapaGastos.values());
  };

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
