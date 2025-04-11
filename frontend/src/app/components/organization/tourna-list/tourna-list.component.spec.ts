import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournaListComponent } from './tourna-list.component';

describe('TournaListComponent', () => {
  let component: TournaListComponent;
  let fixture: ComponentFixture<TournaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
