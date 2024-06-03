import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable, tap } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { environment } from '../environment';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  apiUrl = environment.urlBase() + "gestorGastos/Registro";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  //'https://localhost:7011/gestorGastos/Registro?idUsuario=1&periodo=2022-12'
  GetAll(idUsuario: number, periodo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${idUsuario.toString()}&periodo=${periodo}`);    
  }
  
  Insert(element: Registro): Observable<any> {
    console.log(element)
    console.log(this.apiUrl)
    return this.http.post<any>(this.apiUrl + "/", element).pipe(tap(data=>{  
      console.log(data) 
      console.log(data.status) 
      return data
      }));
    }

  actualizar(element: Registro): Observable<Registro>{
    return this.http.put<Registro>(this.apiUrl, element);
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
