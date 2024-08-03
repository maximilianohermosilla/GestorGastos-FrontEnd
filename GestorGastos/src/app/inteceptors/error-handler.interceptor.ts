import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { inject } from '@angular/core';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent){
      errorMessage = `Error: ${error.error.message}`;
    }
    else{
      console.log(`Error code: ${error.status}, message: ${error.error.message}`);
      errorMessage = error.message;
    }
    console.log(error)
    
    errorService.showError(errorMessage);
    //return throwError(() => errorMessage);
    return EMPTY;
  }))
};
