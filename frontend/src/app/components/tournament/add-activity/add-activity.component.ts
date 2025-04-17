import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Activity } from '../../../types/activity';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { CreateActivityResponse } from '../../../types/activity';
import { CREATE_ACTIVITY } from '../../../graphql/mutations/activity.mutation';

@Component({
  selector: 'app-add-activity',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './add-activity.component.html',
  styleUrl: './add-activity.component.scss'
})
export class AddActivityComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() activityCreated = new EventEmitter<Activity>();

  private apollo = inject(Apollo);
  private route = inject(ActivatedRoute);

  activityForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.activityForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submit(): void {
    if (this.activityForm.valid) {
      const formValue = this.activityForm.value;

      const tournamentId = Number(this.route.snapshot.paramMap.get('id'));

      const variables = {
        input: {
          name: formValue.name.toUpperCase(),
          tournamentId
        }
      };

      this.apollo.mutate<CreateActivityResponse>({
        mutation: CREATE_ACTIVITY,
        variables
      }).subscribe({
        next: ({ data }) => {
          if (data?.createActivity?.success) {
            console.log('Activity creation successful:', data.createActivity.activity);
            this.activityCreated.emit(data.createActivity.activity);
            this.resetForm();
            this.closeDialog();
          } else {
            console.error('Error:', data?.createActivity?.message);
          }
        },
        error: (error) => console.error('Mutation error:', error)
      });
    } else {
      console.warn('Form is invalid:', this.activityForm.errors);
    }
  }

  resetForm(): void {
    this.activityForm.reset({
      id: '',
      name: '',
      abbreviation: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
