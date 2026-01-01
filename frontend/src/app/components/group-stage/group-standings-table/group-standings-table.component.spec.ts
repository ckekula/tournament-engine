import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupStandingsTableComponent } from './group-standings-table.component';

describe('GroupStandingsTableComponent', () => {
  let component: GroupStandingsTableComponent;
  let fixture: ComponentFixture<GroupStandingsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupStandingsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupStandingsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
