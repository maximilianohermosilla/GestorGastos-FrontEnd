import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { RegistroService } from 'src/app/services/registro.service';
import { AbmRegistroComponent } from '../abm-registro/abm-registro.component';

@Component({
  selector: 'app-card-registro',
  templateUrl: './card-registro.component.html',
  styleUrl: './card-registro.component.css'
})
export class CardRegistroComponent {
  @Input() registro: any;

  constructor(private registroService: RegistroService, private dialogoConfirmacion: MatDialog, public dialog: MatDialog, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    //console.log(this.registro)
  }

  updateRegistro() {
    const dialogRef = this.dialog.open(AbmRegistroComponent, {
          width: "90vw",
          maxHeight: '80vh',
          disableClose: false, 
          data: this.registro 
        });
        dialogRef.afterClosed().subscribe( res => {
            this.cdr.detectChanges();
        })   
  }

  pagarRegistro() {
    this.dialogoConfirmacion.open(ConfirmDialogComponent, {
      data: `¿Desea confirmar el pago de: ${this.registro.descripcion} $${this.registro.valor} (${this.registro.fecha.substring(0, 7)})?`
    })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.registro.pagado = true;
          this.registro.fechaPago = formatDate(new Date(), 'yyyy-MM-dd', 'en');

          this.registroService.Update(this.registro).subscribe(result => {
            
          });
        }
      });
  }
}
