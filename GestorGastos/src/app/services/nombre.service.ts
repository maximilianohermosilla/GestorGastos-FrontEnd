import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { environment } from '../environment';
import { ObjetoNombre } from '../models/objeto-nombre';

@Injectable({
  providedIn: 'root'
})
export class NombreService {
  apiUrl = environment.urlBase() + "gestorGastos/";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  public GetById(element: ObjetoNombre): Observable<any> {
    return this.http.get<any>(this.apiUrl + element.clase + "/" + element.id);
  }

  public GetAll(clase: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + clase);    
  }
  
  public nuevo(element: ObjetoNombre): Observable<any> {
    return this.http.post<ObjetoNombre>(this.apiUrl + element.clase + "/", element);
  }

  public actualizar(element: ObjetoNombre): Observable<ObjetoNombre>{
    return this.http.put<ObjetoNombre>(this.apiUrl + element.clase + "/", element);
  }

  public eliminarById(element: ObjetoNombre): Observable<any>{
    return this.http.delete<any>(this.apiUrl + element.clase + "/" + element.id);
  }

  public eliminar(element: ObjetoNombre): Observable<any>{
    return this.http.delete<any>(this.apiUrl + element.clase + "/" + element.id)
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

