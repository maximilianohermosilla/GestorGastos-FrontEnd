import { Component, Input } from '@angular/core';
import { Registro } from 'src/app/models/registro';

@Component({
  selector: 'app-card-registro',
  templateUrl: './card-registro.component.html',
  styleUrl: './card-registro.component.css'
})
export class CardRegistroComponent {
  @Input() registro: any; 

}
