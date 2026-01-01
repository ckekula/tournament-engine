import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupParticipantsComponent } from './assign-group-participants.component';

describe('AssignGroupParticipantsComponent', () => {
  let component: AssignGroupParticipantsComponent;
  let fixture: ComponentFixture<AssignGroupParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignGroupParticipantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignGroupParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
