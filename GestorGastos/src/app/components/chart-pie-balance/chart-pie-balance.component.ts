import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';
import { GrillaCardIngresoComponent } from '../grilla-card-ingreso/grilla-card-ingreso.component';

@Component({
  selector: 'app-chart-pie-balance',
  templateUrl: './chart-pie-balance.component.html',
  styleUrl: './chart-pie-balance.component.css'
})

export class ChartPieBalanceComponent {
  @Input() dataRegistros: any;
  @Input() dataIngresos: any;
  single: any[] = [];
  view: any = [340, 280];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: any = 'below';
  legendTitle: string = "Ingresos";

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#3448c5']
  };

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
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
      }, { Ingreso: 0 });

      chartValues.push({ name: "Disponible", value: resultadoIngresos.Ingreso - resultadoRegistros.NoPagado - resultadoRegistros.Pagado })
      chartValues.push({ name: "A pagar", value: resultadoRegistros.NoPagado })
      chartValues.push({ name: "Pagado", value: resultadoRegistros.Pagado })

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
    }, { Ingreso: 0 });

    chartValues.push({ name: "Disponible", value: resultadoIngresos.Ingreso - resultadoRegistros.NoPagado - resultadoRegistros.Pagado })
    chartValues.push({ name: "A pagar", value: resultadoRegistros.NoPagado })
    chartValues.push({ name: "Pagado", value: resultadoRegistros.Pagado })

    this.legendTitle = "Ingresos: $" + resultadoIngresos.Ingreso.toLocaleString("es-AR");
    this.single = chartValues;
  }

  onSelect(data: any): void {
    const categoriaSelected = JSON.parse(JSON.stringify(data));
    const leyenda = categoriaSelected.name ?? categoriaSelected;
    if(leyenda == "Disponible"){
      //const ingresos = this.dataIngresos.filter((r: any) => r.pagado == (categoriaSelected.name == "Pagado"));
      //this.getDetalleIngresos(this.dataIngresos)  
    }
    else{
      const registrosCategoria = this.dataRegistros.filter((r: any) => r.pagado == (leyenda == "Pagado"));
      this.getDetalle(registrosCategoria)
    }
  }

  onActivate(data: any): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getDetalle(data: any) {
    const dialogRef = this.dialog.open(GrillaCardRegistroComponent, {
      width: "99vw",
      minWidth: "60vw",
      maxHeight: '80vh',
      disableClose: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }
  
  getDetalleIngresos(data: any) {
    const dialogRef = this.dialog.open(GrillaCardIngresoComponent, {
      width: "99vw",
      minWidth: "60vw",
      maxHeight: '80vh',
      disableClose: false,
      data: data
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }
}
