import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { environment } from '../environment';
import { Cuenta } from '../models/cuenta';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  apiUrl = environment.urlBase() + "gestorGastos/Cuenta";
  
  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }

  public GetAll(): Observable<any> {
    let userId = this.tokenService.getUserId();
    return this.http.get<any[]>(this.apiUrl + "?idUsuario=" + userId.toString());    
  }
  
  public Insert(element: Cuenta): Observable<any> {
    return this.http.post<Cuenta>(this.apiUrl, element);
  }

  public actualizar(element: Cuenta): Observable<Cuenta>{
    return this.http.put<Cuenta>(this.apiUrl, element);
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
