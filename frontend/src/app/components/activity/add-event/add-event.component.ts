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
import { ActivityService } from '../../../services/activity.service';

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
  activity!: Activity;
  tournamentId = Number(this.route.snapshot.paramMap.get('id')!);
  activitySlug = this.route.snapshot.paramMap.get('activitySlug')!;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private eventService: EventService,
    private categoryService: CategoryService
  ) {
    this.eventForm = this.fb.group({
      name: [''],
      categories: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.activityService.getByTournamentAndSlug(this.tournamentId, this.activitySlug).subscribe({
      next: (activity) => {
        this.activity = activity;
        this.loading = true;
        this.categoryService.getByActivity(activity.id).subscribe({
          next: (categories) => {
            this.categories = categories;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error fetching categories:', err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching activity:', err);
      }
    });
  }

  submit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      this.eventService.create({
        ...formValue,
        tournamentId: this.tournamentId,
        activitySlug: this.activitySlug,
        categoryIds: formValue.categories.map((cat: Category) => cat.id)
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
