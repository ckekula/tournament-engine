import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Category } from '../../../types/models';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute } from '@angular/router';

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

  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: [''],
    });
  }

  submit(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const tournamentId = Number(this.route.snapshot.paramMap.get('id'));
      const activitySlug = this.route.snapshot.paramMap.get('activitySlug');
      
      this.categoryService.create({
        ...formValue,
        tournamentId,
        activitySlug
      }).subscribe({
        next: (category) => {
          this.categoryCreated.emit(category);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });

    }
  }

  resetForm(): void {
    this.categoryForm.reset({
      name: '',
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
