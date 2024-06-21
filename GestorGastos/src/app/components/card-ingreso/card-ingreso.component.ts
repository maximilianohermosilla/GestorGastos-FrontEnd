import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-ingreso',
  templateUrl: './card-ingreso.component.html',
  styleUrl: './card-ingreso.component.css'
})
export class CardIngresoComponent {
  @Input() registro: any;

  
}
