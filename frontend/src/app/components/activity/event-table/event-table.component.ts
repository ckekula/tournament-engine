import { Component } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { _Event } from '../../../types/models';
import { AddEventComponent } from '../add-event/add-event.component';
import { AddCategoryComponent } from '../add-category/add-category.component';

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
export class EventTableComponent {

  events: _Event [] = [
    { id: 1, name: 'Basketball - Men', categories: [] },
    { id: 2, name: 'Basketball - Women', categories: [1, 2] },
  ]

  categories = [
    { id: 1, name: 'Under 18' },
  ]

  selectedEvent!: _Event;

  loading: boolean = false; //set to true later

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  newEventVisible = false;
  newCategoryVisible = false;

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToEvent(category: string) {
    const tournaSlug = this.route.snapshot.paramMap.get('tournaSlug');
    const tournaId = this.route.snapshot.paramMap.get('id');
    const actSlug = this.route.snapshot.paramMap.get('actSlug');
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    this.router.navigate([tournaSlug, tournaId, actSlug, categorySlug], { relativeTo: this.route.root });
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
