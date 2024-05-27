import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    ConfirmDialogComponent,
    DialogComponent,
    LoginComponent,
    FooterComponent,
    SpinnerComponent,
    ToolbarComponent,
    LandingPageComponent,
    AbmNombreComponent,
    TarjetaComponent,
    BalancePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [DatePipe, FilterPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'fr' },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptorService, multi: true}, 
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
