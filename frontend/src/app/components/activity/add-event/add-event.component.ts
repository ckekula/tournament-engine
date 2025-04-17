import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { _Event, createEventResponse } from '../../../types/event';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { CREATE_EVENT } from '../../../graphql/mutations/event.mutation';

@Component({
  selector: 'app-add-event',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() eventCreated = new EventEmitter<_Event>();

  private apollo = inject(Apollo);
  private route = inject(ActivatedRoute);
  
  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      id: [''],
      name: [''],
      gender: [''],
      weightClass: [''],
      ageGroup: [''],
    });
  }

  submit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      const tournamentId = Number(this.route.snapshot.paramMap.get('id'));
      const activityName = this.route.snapshot.paramMap.get('actName') || '';

      const variables = {
        input: {
          name: formValue.name.toUpperCase(),
          gender: formValue.gender,
          weightClass: formValue.weightClass,
          ageGroup: formValue.ageGroup,
          tournamentId,
          activityName: activityName.toUpperCase()
        }
      };

      this.apollo.mutate<createEventResponse>({
        mutation: CREATE_EVENT,
        variables
      }).subscribe({
        next: ({ data }) => {
          if (data?.createEvent?.success) {
            this.eventCreated.emit(data.createEvent.event);
            this.resetForm();
            this.closeDialog();
          } else {
            console.error('Error:', data?.createEvent?.message);
          }
        },
        error: (error) => console.error('Mutation error:', error)
      });
    } else {
      console.warn('Form is invalid:', this.eventForm.errors);
    }
  }
  resetForm(): void {
    this.eventForm.reset({
      id: '',
      name: '',
      category: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
