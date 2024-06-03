import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/shared/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(public dialogoConfirmacion: MatDialog) { }
  showError(errorMsg: string){
    this.dialogoConfirmacion.open(DialogComponent, {
      data: {
        titulo: "Error",
        mensaje: errorMsg,
        icono: "warning",
        clase: "class-error"
      }
    })
  }
}
