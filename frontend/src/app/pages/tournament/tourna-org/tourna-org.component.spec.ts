import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournaOrgComponent } from './tourna-org.component';

describe('TournaOrgComponent', () => {
  let component: TournaOrgComponent;
  let fixture: ComponentFixture<TournaOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournaOrgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournaOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
