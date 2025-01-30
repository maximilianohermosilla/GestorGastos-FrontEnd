import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
    let intReq = req;
    const token = this.tokenService.getToken() || "";

    if (token){
      //intReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
      intReq = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(intReq).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status === 401) {
          console.log(err)
          //this.router.navigateByUrl('/login');
        }

        return throwError( err );

      })
    );
  }

}