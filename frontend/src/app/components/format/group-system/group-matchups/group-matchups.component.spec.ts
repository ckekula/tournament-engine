import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMatchupsComponent } from './group-matchups.component';

describe('GroupMatchupsComponent', () => {
  let component: GroupMatchupsComponent;
  let fixture: ComponentFixture<GroupMatchupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMatchupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupMatchupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
