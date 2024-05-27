import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardIngresoComponent } from './card-ingreso.component';

describe('CardIngresoComponent', () => {
  let component: CardIngresoComponent;
  let fixture: ComponentFixture<CardIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardIngresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
