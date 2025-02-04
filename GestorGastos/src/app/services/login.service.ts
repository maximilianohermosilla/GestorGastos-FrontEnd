import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JwtDTO } from '../models/jwt';
import { Usuario } from '../models/usuario';
import { environment } from '../environment';
import { SpinnerService } from './spinner.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = environment.urlBase();
  token: any;
  isLogin: boolean = false;
  currentUserSubject: BehaviorSubject<any>;

  jwtHelper = new JwtHelperService();
  decodeToken: any;
  expirationDate: any;
  isExpired: any;

  constructor(private httpClient: HttpClient, private router: Router, private spinnerService: SpinnerService, private tokenService: TokenService) { 
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
  }

  public GetById(id: Number): Observable<any> {
    return this.httpClient.get<any>(this.apiUrl + id);
  }

  public GetAll(): Observable<any> {
    return this.httpClient.get<any[]>(this.apiUrl);    
  }  

  iniciarSesion(credenciales: Usuario): Observable<JwtDTO>{
    return this.httpClient.post<any>(this.apiUrl + 'login', credenciales).pipe(map(data=>{   
        this.decodeToken = this.jwtHelper.decodeToken(data.token);
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(this.decodeToken.unique_name);
        this.tokenService.setUserId(this.decodeToken.nameid);
        this.tokenService.setAuthorities(this.decodeToken.role);
        sessionStorage.setItem('curentUser', JSON.stringify(this.decodeToken));
        this.currentUserSubject.next(this.decodeToken);

        return this.decodeToken;
      }))
  }

  get UsuarioAutenticado(){
    return this.currentUserSubject.value;
  }


  logout(){
    this.isLogin = false;
  }

  public get logIn(): boolean {
    //return (localStorage.getItem('token') !== null);
    return this.isLogin;
  }
}
