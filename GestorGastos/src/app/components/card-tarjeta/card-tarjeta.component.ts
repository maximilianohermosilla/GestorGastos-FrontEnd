import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-tarjeta',
  templateUrl: './card-tarjeta.component.html',
  styleUrl: './card-tarjeta.component.css'
})
export class CardTarjetaComponent {
  @Input() tarjeta: any; 

}
