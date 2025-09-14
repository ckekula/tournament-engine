import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Activity } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../../services/activity.service';
import { ActivatedRoute } from '@angular/router';

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

  activityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private route: ActivatedRoute
  ) {
    this.activityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submit(): void {
    if (this.activityForm.valid) {
      const formValue = this.activityForm.value;
      const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
      
      this.activityService.create({
        ...formValue,
        tournamentId
      }).subscribe({
        next: (activity) => {
          this.activityCreated.emit(activity);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating activity:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.activityForm.reset({
      name: '',
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
