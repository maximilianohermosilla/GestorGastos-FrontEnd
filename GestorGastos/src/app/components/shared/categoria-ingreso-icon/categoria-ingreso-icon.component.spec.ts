import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaIngresoIconComponent } from './categoria-ingreso-icon.component';

describe('CategoriaIngresoIconComponent', () => {
  let component: CategoriaIngresoIconComponent;
  let fixture: ComponentFixture<CategoriaIngresoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaIngresoIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriaIngresoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
