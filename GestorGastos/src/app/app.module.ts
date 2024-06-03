import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { MaterialModule } from './modules/material/material.module';
import { SharedModule } from './modules/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common'
import { FilterPipe } from './pipes/filter.pipe';

import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './components/shared/dialog/dialog.component';
import { LoginComponent } from './components/login/login.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { BalancePageComponent } from './components/balance-page/balance-page.component';
import { SpinnerInterceptorService } from './services/spinner-interceptor.service';
import { InterceptorService } from './services/interceptor.service';
import { AbmNombreComponent } from './components/shared/abm-nombre/abm-nombre.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { GrillaCardRegistroComponent } from './components/shared/grilla-card-registro/grilla-card-registro.component';
import { GrillaCardIngresoComponent } from './components/shared/grilla-card-ingreso/grilla-card-ingreso.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartPieBalanceComponent } from './components/shared/chart-pie-balance/chart-pie-balance.component';
import { ChartBarVerticalBalanceComponent } from './components/shared/chart-bar-vertical-balance/chart-bar-vertical-balance.component';
import { RegistroGastosPageComponent } from './components/registro-gastos-page/registro-gastos-page.component';
import { HeaderBannerComponent } from './components/shared/header-banner/header-banner.component';
import { RegistroIngresosPageComponent } from './components/registro-ingresos-page/registro-ingresos-page.component';
import { FormPeriodoComponent } from './components/shared/form-periodo/form-periodo.component';
import { CardRegistroComponent } from './components/shared/card-registro/card-registro.component';
import { CardIngresoComponent } from './components/shared/card-ingreso/card-ingreso.component';
import { CardSuscripcionComponent } from './components/shared/card-suscripcion/card-suscripcion.component';
import { CardFinanciacionComponent } from './components/shared/card-financiacion/card-financiacion.component';
import { GrillaSuscripcionesComponent } from './components/shared/grilla-suscripciones/grilla-suscripciones.component';
import { GrillaRegistrosVinculadosComponent } from './components/shared/grilla-registros-vinculados/grilla-registros-vinculados.component';
import { AbmRegistroComponent } from './components/shared/abm-registro/abm-registro.component';
import { AbmRegistroVinculadoComponent } from './components/shared/abm-registro-vinculado/abm-registro-vinculado.component';
import { AbmSuscripcionComponent } from './components/shared/abm-suscripcion/abm-suscripcion.component';
import { errorHandlerInterceptor } from './inteceptors/error-handler.interceptor';
import { spinnerInterceptor } from './inteceptors/spinner.interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AbmIngresoComponent } from './components/shared/abm-ingreso/abm-ingreso.component';

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
    ToolbarComponent,
    LandingPageComponent,
    AbmNombreComponent,
    TarjetaComponent,
    BalancePageComponent,
    GrillaCardRegistroComponent,
    GrillaCardIngresoComponent,
    ChartPieBalanceComponent,
    ChartBarVerticalBalanceComponent,
    RegistroGastosPageComponent,
    RegistroIngresosPageComponent,
    FormPeriodoComponent,
    CardRegistroComponent,
    CardIngresoComponent,
    CardSuscripcionComponent,
    CardFinanciacionComponent,
    GrillaSuscripcionesComponent,
    GrillaRegistrosVinculadosComponent,
    AbmRegistroComponent,
    AbmRegistroVinculadoComponent,
    AbmSuscripcionComponent,
    AbmIngresoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxChartsModule
  ],
  providers: [DatePipe, FilterPipe,
    provideHttpClient(withInterceptors([spinnerInterceptor, errorHandlerInterceptor])),
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
    //{ provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true}, 
    //{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}, provideAnimationsAsync()
    //{ provide: HTTP_INTERCEPTORS, useClass: provideHttpClient(withInterceptors([errorHandlerInterceptor])), multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
