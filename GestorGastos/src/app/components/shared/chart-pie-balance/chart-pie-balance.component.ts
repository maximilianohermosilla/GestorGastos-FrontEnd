import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-pie-balance',
  templateUrl: './chart-pie-balance.component.html',
  styleUrl: './chart-pie-balance.component.css'
})

export class ChartPieBalanceComponent {
  @Input() dataRegistros: any;
  @Input() dataIngresos: any;
  single: any[] = [];
  view: any = [340, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';
  legendTitle: string = "Ingresos";

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      let chartValues: any[] = [];

      const resultadoRegistros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
        if (gasto.pagado) {
          acumulador.Pagado += gasto.valor;
        } else {
          acumulador.NoPagado += gasto.valor;
        }
        return acumulador;
      }, { Pagado: 0, NoPagado: 0 });
      
      const resultadoIngresos = this.dataIngresos.reduce((acumulador: any, ingreso: any) => {
        acumulador.Ingreso += ingreso.valor;
        return acumulador;
      }, {Ingreso: 0});

      chartValues.push({name: "Disponible", value: resultadoIngresos.Ingreso - resultadoRegistros.NoPagado - resultadoRegistros.Pagado})
      chartValues.push({name: "A pagar", value: resultadoRegistros.NoPagado})
      chartValues.push({name: "Pagado", value: resultadoRegistros.Pagado})

      this.legendTitle = "Ingresos: $" + resultadoIngresos.Ingreso.toString();
      this.single = chartValues;
    }, 500);
  } 

  ngOnChanges() {
    let chartValues: any[] = [];

      const resultadoRegistros = this.dataRegistros.reduce((acumulador: any, gasto: any) => {
        if (gasto.pagado) {
          acumulador.Pagado += gasto.valor;
        } else {
          acumulador.NoPagado += gasto.valor;
        }
        return acumulador;
      }, { Pagado: 0, NoPagado: 0 });
      
      const resultadoIngresos = this.dataIngresos.reduce((acumulador: any, ingreso: any) => {
        acumulador.Ingreso += ingreso.valor;
        return acumulador;
      }, {Ingreso: 0});

      chartValues.push({name: "Disponible", value: resultadoIngresos.Ingreso - resultadoRegistros.NoPagado - resultadoRegistros.Pagado})
      chartValues.push({name: "A pagar", value: resultadoRegistros.NoPagado})
      chartValues.push({name: "Pagado", value: resultadoRegistros.Pagado})

      this.legendTitle = "Ingresos: $" + resultadoIngresos.Ingreso.toLocaleString("es-AR");
      this.single = chartValues;
  }

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
