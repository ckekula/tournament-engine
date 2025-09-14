import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { _Event, Category } from '../../../types/models';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddCategoryComponent } from '../add-category/add-category.component';
import { EventService } from '../../../services/event.service';

@Component({
  selector: 'app-event-table',
  imports: [
    TableModule, 
    TagModule, 
    IconFieldModule, 
    InputTextModule, 
    InputIconModule, 
    MultiSelectModule, 
    SelectModule, 
    CommonModule,
    AddEventComponent,
    AddCategoryComponent
  ],
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.scss'
})
export class EventTableComponent implements OnInit {
  categories: Category[] = [];
  events: _Event[] = [];
  selectedEvent!: _Event;
  loading: boolean = false; //set to true later
  newEventVisible = false;
  newCategoryVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    const activityId = Number(this.route.snapshot.paramMap.get('activityId'));
    this.loading = true;
    this.eventService.getByActivity(activityId).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToEvent(eventId: number, eventName: string) {
    const eventSlug = eventName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    this.router.navigate([`${eventId}/${eventSlug}`], { relativeTo: this.route });
  }

  toggleNewEvent(): void {
    this.newEventVisible = true;
  }

  toggleNewCategory(): void {
    this.newCategoryVisible = true;
  }

  addEvent(event: _Event): void {
    this.events = [...this.events, event];
  }

  addCategory(category: any): void {
    this.categories = [...this.categories, category];
  }
}
