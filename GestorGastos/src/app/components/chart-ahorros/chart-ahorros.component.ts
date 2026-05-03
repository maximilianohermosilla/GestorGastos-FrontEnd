import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrillaCardRegistroAhorroComponent } from '../grilla-card-registro-ahorro/grilla-card-registro-ahorro.component';

@Component({
  selector: 'app-chart-ahorros',
  templateUrl: './chart-ahorros.component.html',
  styleUrl: './chart-ahorros.component.css'
})
export class ChartAhorrosComponent {
  @Input() dataAhorros: any[] = [];

  multiTotal: any[] = [];
  multiPorCuenta: any[] = [];

  view: any = [this.getViewWidth(), this.getViewHeight()];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = false;
  xAxisLabel: string = 'Periodo';
  yAxisLabel: string = 'Valor';
  legendPosition: any = 'below';

  colorScheme: any = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.setData();
    }, 500);
  }

  ngOnChanges() {
    this.view = [this.getViewWidth(), this.getViewHeight()];
    this.setData();
  }

  getViewWidth(): number {
    return window.innerWidth * 0.95;
  }

  getViewHeight(): number {
    return Math.max(300, window.innerHeight * 0.4);
  }

  public setData() {
    this.multiTotal = this.transformDataTotal(this.dataAhorros);
    this.multiPorCuenta = this.transformDataPorCuenta(this.dataAhorros);
    this.cdr.detectChanges();
  }

  public transformDataTotal(data: any[]): any[] {
    const groupedData: { [key: string]: number } = {};

    data.forEach(item => {
      const period = item.periodo;
      const value = item.valor;

      if (!groupedData[period]) {
        groupedData[period] = 0;
      }
      groupedData[period] += value;
    });

    const series = Object.keys(groupedData).map(key => ({
      name: key,
      value: groupedData[key]
    })).sort((a: any, b: any) => a.name.localeCompare(b.name));

    return [
      {
        name: 'Ahorro Total',
        series: series
      }
    ];
  }

  public transformDataPorCuenta(data: any[]): any[] {
    const groupedData: { [key: string]: any } = {};

    data.forEach(item => {
      const cuentaName = item.cuenta?.nombre || 'Sin Cuenta';
      const period = item.periodo;
      const value = item.valor;

      if (!groupedData[cuentaName]) {
        groupedData[cuentaName] = {
          name: cuentaName,
          series: []
        };
      }

      const seriesItem = groupedData[cuentaName].series.find((series: any) => series.name === period);
      if (seriesItem) {
        seriesItem.value += value;
      } else {
        groupedData[cuentaName].series.push({ name: period, value });
      }
    });

    Object.values(groupedData).forEach((cuenta: any) => {
      cuenta.series.sort((a: any, b: any) => a.name.localeCompare(b.name));
    });

    return Object.values(groupedData);
  }

  onSelect(data: any): void {
    const selected = JSON.parse(JSON.stringify(data));
    let filteredData = [];

    if (selected.series) {
      // It's a point in a series
      filteredData = this.dataAhorros.filter(r =>
        (r.cuenta?.nombre === selected.name || selected.name === 'Ahorro Total') &&
        r.periodo === selected.series
      );
    } else {
      // It's a category
      filteredData = this.dataAhorros.filter(r => r.periodo === selected.name);
    }

    if (filteredData.length > 0) {
      this.getDetalle(filteredData);
    }
  }

  getDetalle(data: any) {
    const dialogRef = this.dialog.open(GrillaCardRegistroAhorroComponent, {
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
