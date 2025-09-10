import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournaSectionComponent } from './tourna-section.component';

describe('TournaSectionComponent', () => {
  let component: TournaSectionComponent;
  let fixture: ComponentFixture<TournaSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournaSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournaSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
