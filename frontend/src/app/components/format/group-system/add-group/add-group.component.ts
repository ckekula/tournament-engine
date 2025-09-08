import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Group } from '../../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-add-group',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule
  ],
  templateUrl: './add-group.component.html',
  styleUrl: './add-group.component.scss'
})
export class AddGroupComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() groupCreated = new EventEmitter<Group>();

  groupForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  submit(): void {
    if (this.groupForm.valid) {
      this.groupCreated.emit(this.groupForm.value);
      this.resetForm();
      this.closeDialog();
    }
  }

  resetForm(): void {
    this.groupForm.reset({
      id: '',
      name: '',
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
