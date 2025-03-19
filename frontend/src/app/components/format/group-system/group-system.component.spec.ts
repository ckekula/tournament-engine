import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSystemComponent } from './group-system.component';

describe('GroupSystemComponent', () => {
  let component: GroupSystemComponent;
  let fixture: ComponentFixture<GroupSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSystemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
