import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, tap } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { environment } from '../environment';
import { RegistroAhorro } from '../models/registro-ahorro';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroAhorroService {
  apiUrl = environment.urlBase() + "gestorGastos/RegistroAhorro";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  GetById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  GetAll(idUsuario: number, periodo: string, descripcion?: string): Observable<any> {
    let userId = this.tokenService.getUserId();
    let url = `${this.apiUrl}?idUsuario=${userId.toString()}&periodo=${periodo}`;
    if (descripcion) url += `&descripcion=${descripcion}`;
    return this.http.get<any[]>(url);    
  }
  
  Insert(element: RegistroAhorro): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/", element).pipe(tap(data=>{  
      return data
      }));
    }

  Update(element: RegistroAhorro): Observable<any>{
    return this.http.put<any>(this.apiUrl, element).pipe(tap(data=>{  
      return data
      }));;
  }

  eliminarById(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "/" + id);
  }

  eliminar(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "/" + id)
    .pipe(
      catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
              errorMsg = `Error: ${error.error}`;
          } else {
              errorMsg = this.getServerErrorMessage(error);
          }
          this.dialogoConfirmacion.open(DialogComponent, {
            data: {
              titulo: "Error",
              mensaje: errorMsg,
              icono: "warning",
              clase: "class-error"
            }
          })
          return errorMsg;
      })
    );
  }

  getServerErrorMessage(error: HttpErrorResponse): string {    
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.error}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `${error.error}`;
        }

    }
  }
}
