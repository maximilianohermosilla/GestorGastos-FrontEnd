import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/services/login.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { TokenService } from 'src/app/services/token.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() error?: string | null;
  @Output() submitEM = new EventEmitter();
  @Output() btnSubmit = new EventEmitter();
  formGroup: FormGroup;

  loginUsuario: Usuario = {
    Login: '',
    Password: '',
    PasswordNew: '',
    IdSistema: 3
  };
  
  isLogged: boolean = false;
  isLoginFail = false;
  perfil: string = "";
  errMsj: string = "";

  constructor(private formBuilder: FormBuilder, private authService: LoginService, private route: Router, private tokenService: TokenService, 
    public spinnerService: SpinnerService, public dialogoConfirmacion: MatDialog,
    @Optional() public refDialog: MatDialogRef<LoginComponent>){

    this.formGroup = this.formBuilder.group({
      Login: ['',[Validators.required]],
      Password: ['',[Validators.required]],
      IdSistema: 3
      })  
    }
  
    submit() {
      if (this.formGroup.valid) {
        this.submitEM.emit(this.formGroup.value);
      }
    }
  
    ngOnInit(): void {
      if (this.tokenService.getToken()){
        this.isLogged = true;
        this.isLoginFail = false;
        this.perfil = this.tokenService.getAuthorities();
      }
    }
  
    onSubmit(){
      this.btnSubmit.emit();
    }
  
    get User(){
      return this.formGroup.get('user');
    }
  
    get Password(){
      return this.formGroup.get('password');
    }
  
    onLogin(){
      this.spinnerService.show(); 
      this.authService.iniciarSesion(this.loginUsuario).subscribe(data=>{
        this.isLogged = true;
        this.isLoginFail = false;    
        this.perfil = data.role;
        this.dialogoConfirmacion.open(DialogComponent, {
          width: '400px', data: {
            titulo: "Confirmación",
            mensaje: "Acceso Correcto",
            icono: "check_circle",
            clase: "class-success"
          }
        });
        this.refDialog.close(this.loginUsuario);   
      },
      error => {
        if (error.status >= 400){
          error.error = "Usuario o contraseña incorrectas";
        }
        else if (error.status == 0){
          error.error = "No es posible iniciar sesión. Consulte con su administrador";
        }
        else{
          this.isLoginFail = true;
          this.isLogged = false;     
          this.errMsj = error; 
          this.refDialog.close(this.loginUsuario);   
        }
        this.dialogoConfirmacion.open(DialogComponent, {
          data: {
            titulo: "Error",
            mensaje: error.error,
            icono: "warning",
            clase: "class-error"
          }
        })
        this.spinnerService.hide(); 
      }
      )
    }
  
    loginInvitado(){
      this.loginUsuario.Login = "invitado";
      this.loginUsuario.Password = "CLAve123**";
      this.loginUsuario.IdSistema = 3;
      this.onLogin();
    }
  
    loginUser(){
      this.loginUsuario = this.formGroup.value;
      this.onLogin();
    }
  }
    