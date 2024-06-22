import { ChangeDetectorRef, Component } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Navitem } from './models/navitem';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './components/dialog/dialog.component';
import { SpinnerService } from './services/spinner.service';
import { LoginComponent } from './components/login/login.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { TokenService } from './services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'GestorGastos';
  isAdmin: boolean = false;
  mobileQuery: MediaQueryList;
  fillerNav: Navitem[] = [];
  navitem: Navitem = { nombre: "", routerlink: "", icon: "" };
  //fillerNav = Array.from({length: 6}, (_, i) => `Nav Item ${i + 1}`);

  private _mobileQueryListener: () => void;
  userName: string = "";
  userId: string = "";
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, public dialog: MatDialog, public dialogoConfirmacion: MatDialog, private tokenService: TokenService
    , public spinnerService: SpinnerService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void{    
    this.isAdmin  = (this.tokenService.getToken() != null)? true: false;
    this.fillerNav.push({nombre: "Inicio",routerlink: "menu",icon: "home"}); 
    if (this.isAdmin) {
      this.userName = this.tokenService.getUserName();
      this.userId = this.tokenService.getUserId();
      this.fillerNav.push({nombre: "Perfil",routerlink: "perfil",icon: "person"});
      this.fillerNav.push({nombre: "Balance",routerlink: "balance",icon: "balance"});
      this.fillerNav.push({nombre: "Registrar Ingresos",routerlink: "registrar-ingresos",icon: "account_balance"});
      this.fillerNav.push({nombre: "Registrar Gastos",routerlink: "registrar-gastos",icon: "paid"});
      //this.fillerNav.push({nombre: "Alta Tarjeta",routerlink: "tarjeta",icon: "add_card"});
      //this.fillerNav.push({nombre: "Configuración",routerlink: "configuracion",icon: "settings"});
    }
    this.spinnerService.hide();
    //console.log(this.mobileQuery)
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  login(){
    const dialogRef = this.dialog.open(LoginComponent,{
      width: '640px',
      maxWidth: '90vw', 
      disableClose: false, data: {
        title: "Ingresar",        
      } 
    });
    dialogRef.afterClosed().subscribe( res => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    })   
  }

  toggleLogin(){ 
    if(this.tokenService.getToken()){
      this.dialogoConfirmacion.open(ConfirmDialogComponent, {
        data: `¿Está seguro de que desea cerrar la sesión?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.userName = "";
          this.router.navigate(['menu']);
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Confirmación",
              mensaje: "Cierre de sesión exitoso",
              icono: "check_circle",
              clase: "class-success"
            }
          });
          this.tokenService.logOut();          
          setTimeout(() => {
            window.location.reload();            
          }, 1000);
        }
      });      
    }
    else{
      this.login();
    }    
  }
}