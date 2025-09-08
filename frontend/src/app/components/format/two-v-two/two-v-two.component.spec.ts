import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoVTwoComponent } from './two-v-two.component';

describe('TwoVTwoComponent', () => {
  let component: TwoVTwoComponent;
  let fixture: ComponentFixture<TwoVTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoVTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoVTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
