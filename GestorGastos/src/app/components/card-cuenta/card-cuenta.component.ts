import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-cuenta',
  templateUrl: './card-cuenta.component.html',
  styleUrl: './card-cuenta.component.css'
})
export class CardCuentaComponent {
  @Input() cuenta: any; 

}
