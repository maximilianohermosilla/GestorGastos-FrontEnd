import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';

@Component({
  selector: 'app-chart-gastos-cuentas',
  templateUrl: './chart-gastos-cuentas.component.html',
  styleUrl: './chart-gastos-cuentas.component.css'
})
export class ChartGastosCuentasComponent {
  @Input() dataRegistros: any[] = [];
  @Input() selectedCuentas: number[] = [];

  multi: any[] = [];

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
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#7aa3e5', '#a8385d', '#aae3f5']
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
    this.multi = this.transformData(this.dataRegistros, this.selectedCuentas);
    this.cdr.detectChanges();
  }

  public transformData(data: any[], selectedCuentas: number[]): any[] {
    const groupedData: { [key: string]: any } = {};
    
    // Filter data by selected accounts if any are selected
    const filteredData = selectedCuentas.length > 0 
      ? data.filter(item => selectedCuentas.includes(item.idCuenta))
      : data;

    filteredData.forEach(item => {
      const period = item.periodo;
      const accountName = item.cuentaNombre || item.cuenta?.nombre || 'Sin Cuenta';
      const value = item.valor;

      if (!groupedData[period]) {
        groupedData[period] = {
          name: period,
          series: []
        };
      }

      const seriesItem = groupedData[period].series.find((series: any) => series.name === accountName);
      if (seriesItem) {
        seriesItem.value += value;
      } else {
        groupedData[period].series.push({ name: accountName, value });
      }
    });

    return Object.values(groupedData).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  onSelect(data: any): void {
    const selected = JSON.parse(JSON.stringify(data));
    console.log('Selected:', selected);
    
    const filteredData = this.dataRegistros.filter(r => 
      (r.cuentaNombre === selected.name || r.cuenta?.nombre === selected.name) && 
      (selected.series ? r.periodo === selected.series : true)
    );
    
    if (filteredData.length > 0) {
      this.getDetalle(filteredData);
    }
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
}
