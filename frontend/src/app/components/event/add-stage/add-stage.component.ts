import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Stage } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { StageService } from '../../../services/stage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-stage',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './add-stage.component.html',
  styleUrl: './add-stage.component.scss'
})
export class AddStageComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() stageCreated = new EventEmitter<Stage>();

  stageForm: FormGroup;

  formats = [
    { name: 'Single Elimination', value: 'Single Elimination' },
    { name: 'Double Elimination', value: 'Double Elimination' },
    { name: 'Group System', value: 'Group System' },
    { name: 'Round Robin', value: 'Round Robin' },
    { name: 'Swiss System', value: 'Swiss System' },
    { name: 'Ladder System', value: 'Ladder System' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private stageService: StageService
  ) {
    this.stageForm = this.fb.group({
      name: [''],
      format: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submit(): void {
    if (this.stageForm.valid) {
      const formValue = this.stageForm.value;
      const eventId = Number(this.route.snapshot.paramMap.get('eventId'));

      this.stageService.create({
        ...formValue,
        eventId: eventId
      }).subscribe({
        next: (stage) => {
          this.stageCreated.emit(stage);
          this.resetForm();
          this.closeDialog();
        },
        error: (err) => {
          console.error('Error creating stage:', err);
        }
      });
    }
  }

  resetForm(): void {
    this.stageForm.reset({
      name: '',
      format: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
