import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Category } from '../../../types/models';

@Component({
  selector: 'app-add-category',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() categoryCreated = new EventEmitter<Category>();

  eventForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      id: [''],
      name: [''],
    });
  }

  submit(): void {
    if (this.eventForm.valid) {
      this.categoryCreated.emit(this.eventForm.value);
      this.resetForm();
      this.closeDialog();
    }
  }

  resetForm(): void {
    this.eventForm.reset({
      id: '',
      name: '',
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
