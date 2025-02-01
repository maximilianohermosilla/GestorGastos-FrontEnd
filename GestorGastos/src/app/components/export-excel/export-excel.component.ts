import { CommonModule } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/modules/material/material.module';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-export-excel',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './export-excel.component.html',
  styleUrl: './export-excel.component.css'
})
export class ExportExcelComponent implements OnInit{
  public data = input();
  public length: number = 0;

  ngOnInit(): void {
    this.updateLength()
  }  
  
  ngOnChanges(): void {
    this.updateLength()
  }  

  exportExcel() {
    const lista: any = this.data();
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(lista);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'exported-data');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const a: HTMLAnchorElement = document.createElement('a');
    document.body.appendChild(a);
    a.href = URL.createObjectURL(data);
    a.download = `${fileName}.xlsx`;
    a.click();
    document.body.removeChild(a);
  }

  public updateLength(){    
    const lista: any = this.data();
    this.length = lista.length
  }

}
