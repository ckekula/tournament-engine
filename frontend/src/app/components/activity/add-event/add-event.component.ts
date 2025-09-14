import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { _Event, Activity, Category } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-add-event',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule
  ],
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() eventCreated = new EventEmitter<_Event>();

  eventForm: FormGroup;
  categories: Category[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private eventService: EventService,
    private categoryService: CategoryService
  ) {
    this.eventForm = this.fb.group({
      name: [''],
      categories: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const activityId = Number(this.route.snapshot.paramMap.get('activityId'));
    this.loading = true;
    this.categoryService.getByActivity(activityId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const activityId = Number(this.route.snapshot.paramMap.get('activityId'));

      this.eventService.create({
        ...formValue,
        activityId,
      }).subscribe({
        next: (event) => {
          this.eventCreated.emit(event);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating event:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.eventForm.reset({
      name: '',
      categories: []
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
