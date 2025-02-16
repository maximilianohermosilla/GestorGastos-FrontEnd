import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { SharedModule } from './modules/shared/shared.module';
import { MaterialModule } from './modules/material/material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common'
import { FilterPipe } from './pipes/filter.pipe';
import { errorHandlerInterceptor } from './inteceptors/error-handler.interceptor';
import { spinnerInterceptor } from './inteceptors/spinner.interceptor';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { BalancePageComponent } from './pages/balance-page/balance-page.component';
import { RegistroGastosPageComponent } from './pages/registro-gastos-page/registro-gastos-page.component';
import { RegistroIngresosPageComponent } from './pages/registro-ingresos-page/registro-ingresos-page.component';
import { PerfilPageComponent } from './pages/perfil-page/perfil-page.component';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AbmNombreComponent } from './components/abm-nombre/abm-nombre.component';
import { TarjetaComponent } from './components/abm-tarjeta/abm-tarjeta.component';
import { GrillaCardRegistroComponent } from './components/grilla-card-registro/grilla-card-registro.component';
import { GrillaCardIngresoComponent } from './components/grilla-card-ingreso/grilla-card-ingreso.component';
import { ChartPieBalanceComponent } from './components/chart-pie-balance/chart-pie-balance.component';
import { ChartBarVerticalBalanceComponent } from './components/chart-bar-vertical-balance/chart-bar-vertical-balance.component';
import { HeaderBannerComponent } from './components/header-banner/header-banner.component';
import { FormPeriodoComponent } from './components/form-periodo/form-periodo.component';
import { CardRegistroComponent } from './components/card-registro/card-registro.component';
import { CardIngresoComponent } from './components/card-ingreso/card-ingreso.component';
import { CardSuscripcionComponent } from './components/card-suscripcion/card-suscripcion.component';
import { CardFinanciacionComponent } from './components/card-financiacion/card-financiacion.component';
import { GrillaSuscripcionesComponent } from './components/grilla-suscripciones/grilla-suscripciones.component';
import { GrillaRegistrosVinculadosComponent } from './components/grilla-registros-vinculados/grilla-registros-vinculados.component';
import { AbmRegistroComponent } from './components/abm-registro/abm-registro.component';
import { AbmRegistroVinculadoComponent } from './components/abm-registro-vinculado/abm-registro-vinculado.component';
import { AbmSuscripcionComponent } from './components/abm-suscripcion/abm-suscripcion.component';
import { AbmIngresoComponent } from './components/abm-ingreso/abm-ingreso.component';
import { CardCuentaComponent } from './components/card-cuenta/card-cuenta.component';
import { CardTarjetaComponent } from './components/card-tarjeta/card-tarjeta.component';
import { AbmCuentaComponent } from './components/abm-cuenta/abm-cuenta.component';
import { ChartBarHorizontalBalanceComponent } from './components/chart-bar-horizontal-balance/chart-bar-horizontal-balance.component';
import { InterceptorService } from './services/interceptor.service';
import { MatDialogModule } from '@angular/material/dialog';
import { ExportExcelComponent } from './components/export-excel/export-excel.component';
import { ChartsDemoComponent } from './components/charts-demo/charts-demo.component';
import { ReportesPageComponent } from './pages/reportes-page/reportes-page.component';
import { ChartLinealComponent } from './components/chart-lineal/chart-lineal.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    ConfirmDialogComponent,
    DialogComponent,
    HeaderBannerComponent,
    LoginComponent,
    FooterComponent,
    SpinnerComponent,
    TarjetaComponent,
    GrillaCardRegistroComponent,
    GrillaCardIngresoComponent,
    ChartPieBalanceComponent,
    ChartBarVerticalBalanceComponent,
    ChartBarHorizontalBalanceComponent,
    FormPeriodoComponent,
    GrillaSuscripcionesComponent,
    GrillaRegistrosVinculadosComponent,
    CardRegistroComponent,
    CardIngresoComponent,
    CardSuscripcionComponent,
    CardFinanciacionComponent,
    CardCuentaComponent,
    CardTarjetaComponent,
    AbmNombreComponent,
    AbmRegistroComponent,
    AbmRegistroVinculadoComponent,
    AbmSuscripcionComponent,
    AbmIngresoComponent,
    AbmCuentaComponent,
    LandingPageComponent,
    PerfilPageComponent,
    BalancePageComponent,
    RegistroGastosPageComponent,
    RegistroIngresosPageComponent,
    ChartsDemoComponent,
    ReportesPageComponent,
    ChartLinealComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxChartsModule,
    MatDialogModule,
    ExportExcelComponent 
  ],
  providers: [DatePipe, FilterPipe,
    provideHttpClient(withInterceptors([spinnerInterceptor, errorHandlerInterceptor])),
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
    { provide: MAT_DATE_LOCALE, useValue: 'fr', multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true}, 
    //{ provide: HTTP_INTERCEPTORS, useClass: provideHttpClient(withInterceptors([errorHandlerInterceptor])), multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
