import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from './token.service';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  apiUrl = environment.urlBase() + "Usuario";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  public GetAll(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  public GetById(): Observable<any> {
    let userId = this.tokenService.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}/IdUsuario?Id=${userId.toString()}`);    
  }  
  
  public Insert(element: Usuario): Observable<any> {
    return this.http.post<Usuario>(this.apiUrl, element).pipe(map(data=>{ 
      return data
      }));
  }

  public Update(element: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(this.apiUrl, element);
  }
}
