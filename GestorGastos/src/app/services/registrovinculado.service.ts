import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable } from 'rxjs';
import { DialogComponent } from '../components/shared/dialog/dialog.component';
import { environment } from '../environment';
import { RegistroVinculado } from '../models/registro-vinculado';

@Injectable({
  providedIn: 'root'
})
export class RegistroVinculadoService {
  apiUrl = environment.urlBase() + "gestorGastos/RegistroVinculado";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }
  
  //'https://localhost:7011/gestorGastos/RegistroVinculado?idUsuario=1&periodo=2022-12'
  public GetAll(idUsuario: number, periodo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${idUsuario.toString()}&periodo=${periodo}`);    
  }
  
  public Insert(element: RegistroVinculado): Observable<any> {
    return this.http.post<RegistroVinculado>(this.apiUrl, element).pipe(map(data=>{  
      console.log(data) 
      return data
      }));
  }

  public actualizar(element: RegistroVinculado): Observable<RegistroVinculado>{
    return this.http.put<RegistroVinculado>(this.apiUrl, element);
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
