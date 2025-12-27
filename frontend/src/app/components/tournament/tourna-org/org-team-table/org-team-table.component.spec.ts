import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgTeamTableComponent } from './org-team-table.component';

describe('OrgTeamTableComponent', () => {
  let component: OrgTeamTableComponent;
  let fixture: ComponentFixture<OrgTeamTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgTeamTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgTeamTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
