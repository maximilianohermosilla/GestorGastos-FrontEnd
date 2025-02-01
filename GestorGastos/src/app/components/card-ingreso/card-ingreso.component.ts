import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbmIngresoComponent } from '../abm-ingreso/abm-ingreso.component';

@Component({
  selector: 'app-card-ingreso',
  templateUrl: './card-ingreso.component.html',
  styleUrl: './card-ingreso.component.css'
})
export class CardIngresoComponent {
  @Input() registro: any;

  /**
   *
   */
  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  updateIngreso() {
    const dialogRef = this.dialog.open(AbmIngresoComponent, {
      width: "90vw",
      maxHeight: '80vh',
      disableClose: false,
      data: this.registro
    });
    dialogRef.afterClosed().subscribe(res => {
      this.cdr.detectChanges();
    })
  }

}
