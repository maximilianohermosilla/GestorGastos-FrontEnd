import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { environment } from '../environment';
import { Ingreso } from '../models/ingreso';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  apiUrl = environment.urlBase() + "gestorGastos/Ingreso";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  //'https://localhost:7011/gestorGastos/Ingreso?idUsuario=1&periodo=2022-12'
  public GetAll(idUsuario: number, periodo: string): Observable<any> {
    let userId = this.tokenService.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${userId.toString()}&periodo=${periodo}`);    
  }
  
  public Insert(element: Ingreso): Observable<any> {
    return this.http.post<Ingreso>(this.apiUrl, element).pipe(map(data=>{ 
      return data
      }));
  }

  public actualizar(element: Ingreso): Observable<Ingreso>{
    return this.http.put<Ingreso>(this.apiUrl, element);
  }

  public eliminarById(id: number): Observable<any>{
    return this.http.delete<any>(this.apiUrl + "/" + id);
  }

  public eliminar(id: number): Observable<any>{
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

  private getServerErrorMessage(error: HttpErrorResponse): string {    
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
