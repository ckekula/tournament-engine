import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Stage } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

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

  constructor(private fb: FormBuilder) {
    this.stageForm = this.fb.group({
      id: [''],
      name: [''],
      format: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  submit(): void {
    if (this.stageForm.valid) {
      this.stageCreated.emit(this.stageForm.value);
      this.resetForm();
      this.closeDialog();
    }
  }

  resetForm(): void {
    this.stageForm.reset({
      id: '',
      name: '',
      format: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
