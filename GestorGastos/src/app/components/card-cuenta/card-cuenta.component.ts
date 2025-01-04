import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-card-cuenta',
  templateUrl: './card-cuenta.component.html',
  styleUrl: './card-cuenta.component.css'
})
export class CardCuentaComponent {
  @Input() cuenta: any; 
  @Output() emitCuenta = new EventEmitter<any>();
  @Output() emitCuentaToggle = new EventEmitter<any>();

  openCuenta(){
    this.emitCuenta.emit(this.cuenta)
  }

  toggleCuenta(){
    this.emitCuentaToggle.emit(this.cuenta)
  }
}
