import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournaRegisterComponent } from './tourna-register.component';

describe('TournaRegisterComponent', () => {
  let component: TournaRegisterComponent;
  let fixture: ComponentFixture<TournaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournaRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
