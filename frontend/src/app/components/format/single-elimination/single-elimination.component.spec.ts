import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleEliminationComponent } from './single-elimination.component';

describe('SingleEliminationComponent', () => {
  let component: SingleEliminationComponent;
  let fixture: ComponentFixture<SingleEliminationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleEliminationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleEliminationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
