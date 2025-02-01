import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, map, Observable } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { environment } from '../environment';
import { Suscripcion } from '../models/suscripcion';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {
  apiUrl = environment.urlBase() + "gestorGastos/Suscripcion";

  constructor(private http: HttpClient, public dialogoConfirmacion: MatDialog, private tokenService: TokenService) { }

  public GetById(id: Number): Observable<any> {
    return this.http.get<any>(this.apiUrl + "/" + id);
  }

  public GetAll(idUsuario: number, periodo: string): Observable<any> {
    let userId = this.tokenService.getUserId();
    return this.http.get<any[]>(`${this.apiUrl}?idUsuario=${userId.toString()}&periodo=${periodo}`);
  }

  public Insert(element: Suscripcion): Observable<any> {
    return this.http.post<Suscripcion>(this.apiUrl, element).pipe(map(data => {
      return data
    }));
  }

  public Update(element: Suscripcion): Observable<Suscripcion> {
    return this.http.put<Suscripcion>(this.apiUrl, element);
  }

  public eliminarById(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + "/" + id);
  }

  public eliminar(id: number): Observable<any> {
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
