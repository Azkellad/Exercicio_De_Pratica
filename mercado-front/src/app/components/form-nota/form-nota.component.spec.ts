import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNotaComponent } from './form-nota.component';

describe('FormNotaComponent', () => {
  let component: FormNotaComponent;
  let fixture: ComponentFixture<FormNotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormNotaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormNotaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
