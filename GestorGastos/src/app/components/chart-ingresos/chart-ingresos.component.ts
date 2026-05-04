import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrillaCardIngresoComponent } from '../grilla-card-ingreso/grilla-card-ingreso.component';

@Component({
  selector: 'app-chart-ingresos',
  templateUrl: './chart-ingresos.component.html',
  styleUrl: './chart-ingresos.component.css'
})
export class ChartIngresosComponent {
  @Input() dataIngresos: any[] = [];
  @Input() selectedCategories: number[] = [];
  @Output() selectedCategoriesChange = new EventEmitter<number[]>();
  @Input() listaCategoriaIngreso: any[] = [];

  multiTotal: any[] = [];
  multiPorCategoria: any[] = [];

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
    this.multiTotal = this.transformDataTotal(this.dataIngresos);
    this.multiPorCategoria = this.transformDataPorCategoria(this.dataIngresos, this.selectedCategories);
    this.cdr.detectChanges();
  }

  onCategoryChange() {
    this.selectedCategoriesChange.emit(this.selectedCategories);
    this.setData();
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
        name: 'Ingreso Total',
        series: series
      }
    ];
  }

  public transformDataPorCategoria(data: any[], selectedCats: number[]): any[] {
    const groupedData: { [key: string]: any } = {};

    // Filter data by selected categories if any are selected
    const filteredData = selectedCats && selectedCats.length > 0 
      ? data.filter(item => selectedCats.includes(item.idCategoriaIngreso))
      : data;

    filteredData.forEach(item => {
      const period = item.periodo;
      const catName = item.categoriaIngresoNombre || item.categoriaIngreso?.nombre || 'Sin Categoría';
      const value = item.valor;

      if (!groupedData[period]) {
        groupedData[period] = {
          name: period,
          series: []
        };
      }

      const seriesItem = groupedData[period].series.find((series: any) => series.name === catName);
      if (seriesItem) {
        seriesItem.value += value;
      } else {
        groupedData[period].series.push({ name: catName, value });
      }
    });

    return Object.values(groupedData).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  onSelect(data: any): void {
    const selected = JSON.parse(JSON.stringify(data));
    let filteredData = [];

    if (selected.series) {
      if (selected.series === 'Ingreso Total') {
        // Line chart point clicked
        filteredData = this.dataIngresos.filter(r => r.periodo === selected.name);
      } else {
        // Bar chart point clicked
        filteredData = this.dataIngresos.filter(r =>
          (r.categoriaIngresoNombre === selected.name || r.categoriaIngreso?.nombre === selected.name) &&
          r.periodo === selected.series
        );
      }
    } else {
      // It's a category/period (clicking axis label)
      filteredData = this.dataIngresos.filter(r => r.periodo === selected.name);
    }

    if (filteredData.length > 0) {
      this.getDetalle(filteredData);
    }
  }

  getDetalle(data: any) {
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
