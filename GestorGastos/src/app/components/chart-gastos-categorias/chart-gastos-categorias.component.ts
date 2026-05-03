import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GrillaCardRegistroComponent } from '../grilla-card-registro/grilla-card-registro.component';

@Component({
  selector: 'app-chart-gastos-categorias',
  templateUrl: './chart-gastos-categorias.component.html',
  styleUrl: './chart-gastos-categorias.component.css'
})
export class ChartGastosCategoriasComponent {
  @Input() dataRegistros: any[] = [];
  @Input() selectedCategories: number[] = [];

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
    this.multi = this.transformData(this.dataRegistros, this.selectedCategories);
    this.cdr.detectChanges();
  }

  public transformData(data: any[], selectedCats: number[]): any[] {
    const groupedData: { [key: string]: any } = {};
    
    // Filter data by selected categories if any are selected
    const filteredData = selectedCats.length > 0 
      ? data.filter(item => selectedCats.includes(item.idCategoriaGasto))
      : data;

    filteredData.forEach(item => {
      const period = item.periodo;
      const categoryName = item.categoriaGastoNombre || item.categoriaGasto?.nombre || 'Sin Categoría';
      const value = item.valor;

      if (!groupedData[period]) {
        groupedData[period] = {
          name: period,
          series: []
        };
      }

      const seriesItem = groupedData[period].series.find((series: any) => series.name === categoryName);
      if (seriesItem) {
        seriesItem.value += value;
      } else {
        groupedData[period].series.push({ name: categoryName, value });
      }
    });

    return Object.values(groupedData).sort((a: any, b: any) => a.name.localeCompare(b.name));
  }

  onSelect(data: any): void {
    const selected = JSON.parse(JSON.stringify(data));
    // If it's a grouped chart, 'name' is the category and we might need the period from the parent group
    // But ngx-charts select event on grouped bars usually provides the series name
    console.log('Selected:', selected);
    
    // This is a simplification, we might need more logic to find the exact records
    const filteredData = this.dataRegistros.filter(r => 
      (r.categoriaGastoNombre === selected.name || r.categoriaGasto?.nombre === selected.name) && 
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
