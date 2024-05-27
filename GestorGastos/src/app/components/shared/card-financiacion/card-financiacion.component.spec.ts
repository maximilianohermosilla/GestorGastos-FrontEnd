import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardFinanciacionComponent } from './card-financiacion.component';

describe('CardFinanciacionComponent', () => {
  let component: CardFinanciacionComponent;
  let fixture: ComponentFixture<CardFinanciacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardFinanciacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardFinanciacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
