import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbmRegistroAhorroComponent } from '../abm-registro-ahorro/abm-registro-ahorro.component';

@Component({
  selector: 'app-card-registro-ahorro',
  templateUrl: './card-registro-ahorro.component.html',
  styleUrl: './card-registro-ahorro.component.css'
})
export class CardRegistroAhorroComponent {
  @Input() registro: any;

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
  }

  updateRegistro() {
    const dialogRef = this.dialog.open(AbmRegistroAhorroComponent, {
          width: "90vw",
          maxHeight: '80vh',
          disableClose: false, 
          data: this.registro 
        });
        dialogRef.afterClosed().subscribe( res => {
            this.cdr.detectChanges();
        })   
  }
}
