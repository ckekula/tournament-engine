import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundRobinComponent } from './round-robin.component';

describe('RoundRobinComponent', () => {
  let component: RoundRobinComponent;
  let fixture: ComponentFixture<RoundRobinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundRobinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundRobinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
