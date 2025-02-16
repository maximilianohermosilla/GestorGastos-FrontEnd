import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Registro } from 'src/app/models/registro';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';

@Component({
  selector: 'app-chart-lineal',
  templateUrl: './chart-lineal.component.html',
  styleUrl: './chart-lineal.component.css'
})

export class ChartLinealComponent {
  @Input() dataRegistros: any;
  @Input() dataIngresos: any;

  single: any[] = [];

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
  legendTitle: string = "Categorías";

  colorScheme: any = {
    domain: ['#5AA454', '#A10A28', '#C7B42C']
  };

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    setTimeout(() => {
      this.setData();
    }, 500);
  }

  ngOnChanges() {
    this.getViewWidth();
    this.getViewHeight();
    this.setData();
  }

  getViewWidth(): number {
    return window.innerWidth * 0.95;
  }

  getViewHeight(): number {
    return Math.max(200, window.innerHeight * 0.4);
  }

  public setData() {
    const resultado = this.transformData(this.dataRegistros);
    const colorArray: string[] = resultado.map(obj => obj.color);
    this.colorScheme = { domain: colorArray };
    this.single = resultado;
  }

  public transformData(data: any[]): any[] {
    const groupedData: { [key: string]: any } = {};

    data.forEach(item => {
      const categoryName = item.categoriaGastoNombre;
      const period = item.periodo;
      const value = item.valor;
      const color = item.categoriaGasto.color;

      if (!groupedData[categoryName]) {
        groupedData[categoryName] = {
          name: categoryName,
          color: color,
          series: []
        };
      }

      const seriesItem = groupedData[categoryName].series.find((series: any) => series.name === period);
      if (seriesItem) {
        seriesItem.value += value;
      } else {
        groupedData[categoryName].series.push({ name: period, value });
      }
    });

    Object.values(groupedData).forEach(category => {
      category.series.sort((a: any, b: any) => a.name.localeCompare(b.name));
    });

    return Object.values(groupedData);
  }
  
  onSelect(data: any): void {
    const categoriaSelected = JSON.parse(JSON.stringify(data));
    console.log(categoriaSelected)
    const registrosCategoria = this.dataRegistros.filter((r: any) => r.categoriaGasto.nombre == (categoriaSelected.series ?? categoriaSelected) &&
                                                                    r.periodo == (categoriaSelected.name ?? r.periodo) );    
    this.getDetalle(registrosCategoria)
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
