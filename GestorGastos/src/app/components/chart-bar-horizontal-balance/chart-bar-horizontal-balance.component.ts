import { Component, Input } from '@angular/core';
import { Registro } from 'src/app/models/registro';

@Component({
  selector: 'app-chart-bar-horizontal-balance',
  templateUrl: './chart-bar-horizontal-balance.component.html',
  styleUrl: './chart-bar-horizontal-balance.component.css'
})

export class ChartBarHorizontalBalanceComponent {
  @Input() dataRegistros: any;
  @Input() dataIngresos: any;


  single: any[] = [];
  view: any = [340, 280];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = false;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Categorias';
  legendPosition: any = 'below';
  legendTitle: string = "Gastos";

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor() {
  }


  ngOnInit(): void {
    setTimeout(() => {
      const resultado = this.agruparGastosPorCategoria(this.dataRegistros);

      resultado.sort(function (a, b) {
        return a.totalValor < b.totalValor ? 1 : a.totalValor > b.totalValor ? -1 : 0;
      });

      const mappedList: any[] = resultado.map(obj => ({
        name: obj.nombre,
        value: obj.totalValor
      }));

      const colorArray: string[] = resultado.map(obj => obj.color);

      this.single = mappedList;
      this.colorScheme = { domain: colorArray };

      const resultadoGastros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
        acumulador.Gasto += gasto.valor;
        return acumulador;
      }, { Gasto: 0 });

      this.legendTitle = "Gastos: $" + resultadoGastros.Gasto.toString();
    }, 500);
  }

  ngOnChanges() {
    const resultado = this.agruparGastosPorCategoria(this.dataRegistros);

    resultado.sort(function (a, b) {
      return a.totalValor < b.totalValor ? 1 : a.totalValor > b.totalValor ? -1 : 0;
    });

    const mappedList: any[] = resultado.map(obj => ({
      name: obj.nombre,
      value: obj.totalValor
    }));


    const colorArray: string[] = resultado.map(obj => obj.color);

    this.single = mappedList;
    this.colorScheme = { domain: colorArray };

    const resultadoGastros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
      acumulador.Gasto += gasto.valor;
      return acumulador;
    }, { Gasto: 0 });

    this.legendTitle = "Gastos: $" + resultadoGastros.Gasto.toString();
  }

  agruparGastosPorCategoria = (gastos: Registro[]): any[] => {
    const mapaGastos = new Map<string, any>();

    gastos.forEach(gasto => {
      const { nombre, color } = gasto.categoriaGasto!;
      const key = `${nombre}-${color}`;

      if (mapaGastos.has(key)) {
        mapaGastos.get(key)!.totalValor += gasto.valor;
      } else {
        mapaGastos.set(key, { nombre, color, totalValor: gasto.valor });
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
