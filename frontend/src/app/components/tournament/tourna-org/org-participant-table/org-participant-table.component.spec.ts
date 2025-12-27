import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgParticipantTableComponent } from './org-participant-table.component';

describe('OrgParticipantTableComponent', () => {
  let component: OrgParticipantTableComponent;
  let fixture: ComponentFixture<OrgParticipantTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgParticipantTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgParticipantTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
