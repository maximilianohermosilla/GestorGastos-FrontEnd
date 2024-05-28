import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { AbmNombreComponent } from './components/shared/abm-nombre/abm-nombre.component';
import { TarjetaComponent } from './components/tarjeta/tarjeta.component';
import { BalancePageComponent } from './components/balance-page/balance-page.component';
import { RegistroGastosPageComponent } from './components/registro-gastos-page/registro-gastos-page.component';
import { RegistroIngresosPageComponent } from './components/registro-ingresos-page/registro-ingresos-page.component';

const routes: Routes = [
  {
    path: '',    
    redirectTo: 'menu',
    pathMatch: 'full' 
  },
  {
    path: 'menu',
    component: LandingPageComponent
  },
  {
    path: 'tarjeta',
    component: TarjetaComponent
   // canActivate: [GuardGuard] 
  },
  {
    path: 'balance',
    component: BalancePageComponent
   // canActivate: [GuardGuard] 
  },
  {
    path: 'registrar-gastos',
    component: RegistroGastosPageComponent
   // canActivate: [GuardGuard] 
  },  
  {
    path: 'registrar-ingresos',
    component: RegistroIngresosPageComponent
   // canActivate: [GuardGuard] 
  },
  // {
  //   path: 'expediente',
  //   component: ExpedienteAbmComponent,
  //   canActivate: [GuardGuard]
  // },
  // {
  //   path: 'reportes',
  //   component: ReportesComponent,
  //   canActivate: [GuardGuard]
  // },
  // {
  //   path: 'configuracion',
  //   component: ConfiguracionComponent,
  //   canActivate: [GuardGuard]
  // },
  // {
  //   path: '404',
  //    component:NotfoundComponent 
  // },
  // { 
  //   path: '**',
  //   redirectTo: 'menu',
  //   pathMatch: 'full' 
  // }
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent, data :{ idPais :'1', idEstilo: '2', idMarca: '3', idCiudad: 4}
  //   component: DashboardComponent
  // },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
