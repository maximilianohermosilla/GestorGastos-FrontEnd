import 'moment/locale/ja';
import 'moment/locale/fr';
import moment from 'moment';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { default as _rollupMoment, Moment } from 'moment';
import { FORMAT_DATE } from 'src/app/models/format-date';

@Component({
  selector: 'app-form-periodo',
  templateUrl: './form-periodo.component.html',
  styleUrl: './form-periodo.component.css',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: FORMAT_DATE },
  ]
})

export class FormPeriodoComponent {
  @Output() onChange = new EventEmitter<any>();

  formGroup: FormGroup;
  periodo = new FormControl(moment());
  anio = new FormControl();

  dataSource: any;
  fechaPeriodo: string = "";
  fechaAnio: string = "";

  constructor(private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>,
    @Inject(MAT_DATE_LOCALE) private _locale: string) {
    this._locale = 'fr';
    this.dateAdapter.setLocale(this._locale);
    this.formGroup = this.formBuilder.group({
      periodo: ['', [Validators.required]]
    })
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
    this.fechaPeriodo = new Date().getFullYear() + "-" + ("0" + (new Date().getMonth() + 1)).slice(-2);
    
    setTimeout(() => {
      this.onChange.emit(this.fechaPeriodo);      
    }, 1000);
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.periodo.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.periodo.setValue(ctrlValue);

    const month = normalizedMonthAndYear.month() + 1;
    const year = normalizedMonthAndYear.year();
    var monthWithZero = month < 9 ? "0" + month : month;
    this.fechaPeriodo = year + "-" + monthWithZero;

    this.onChange.emit(this.fechaPeriodo);
    datepicker.close();
  }

  setYear(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const year = normalizedYear.year();
    this.fechaPeriodo = year.toString();
    this.fechaAnio = year.toString();

    this.onChange.emit(this.fechaAnio);
    datepicker.close();
  }

}