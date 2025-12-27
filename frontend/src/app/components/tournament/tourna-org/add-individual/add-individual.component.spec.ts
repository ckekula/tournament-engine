import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndividualComponent } from './add-individual.component';

describe('AddIndividualComponent', () => {
  let component: AddIndividualComponent;
  let fixture: ComponentFixture<AddIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIndividualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
