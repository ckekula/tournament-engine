import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredOrgTableComponent } from './registered-org-table.component';

describe('RegisteredOrgTableComponent', () => {
  let component: RegisteredOrgTableComponent;
  let fixture: ComponentFixture<RegisteredOrgTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisteredOrgTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisteredOrgTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
