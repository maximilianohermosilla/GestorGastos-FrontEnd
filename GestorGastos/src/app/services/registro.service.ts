import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable, tap } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { environment } from '../environment';
import { Registro } from '../models/registro';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  apiUrl = environment.urlBase() + "gestorGastos/Registro";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  GetAll(idUsuario: number, periodo: string): Observable<any> {
    let userId = this.tokenService.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${userId.toString()}&periodo=${periodo}`);    
  }
  
  Insert(element: Registro): Observable<any> {
    return this.http.post<any>(this.apiUrl + "/", element).pipe(tap(data=>{  
      return data
      }));
    }

  Update(element: Registro): Observable<Registro>{
    return this.http.put<Registro>(this.apiUrl, element).pipe(tap(data=>{  
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
            //return `Unknown Server Error: ${error.error}`;
            return `${error.error}`;
        }

    }
  }
}
