import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { environment } from '../environment';
import { Suscripcion } from '../models/suscripcion';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {
  apiUrl = environment.urlBase() + "gestorGastos/Suscripcion";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  //'https://localhost:7011/gestorGastos/Suscripcion?idUsuario=1&periodo=2022-12'
  public GetAll(idUsuario: number, periodo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${idUsuario.toString()}&periodo=${periodo}`);    
  }
  
  public nuevo(element: Suscripcion): Observable<any> {
    return this.http.post<Suscripcion>(this.apiUrl, element);
  }

  public actualizar(element: Suscripcion): Observable<Suscripcion>{
    return this.http.put<Suscripcion>(this.apiUrl, element);
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
