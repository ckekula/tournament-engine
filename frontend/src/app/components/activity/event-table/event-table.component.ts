import { Component, inject, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { _Event } from '../../../types/event';
import { AddEventComponent } from '../add-event/add-event.component';
import { Apollo } from 'apollo-angular';
import { GET_EVENTS_BY_ACTIVITY } from '../../../graphql/queries/event.query';

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
    AddEventComponent
  ],
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.scss'
})
export class EventTableComponent implements OnInit {

  private apollo = inject(Apollo);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  hasName: boolean = false;
  hasGender: boolean = false;
  hasWeightClass: boolean = false;
  hasAgeGroup: boolean = false;
  
  events: _Event[] = [];
  selectedEvent!: _Event;
  loading: boolean = false;
  newEventVisible = false;

  ngOnInit(): void { 
    const tournaId = this.route.snapshot.paramMap.get('id');
    const activityName = this.route.snapshot.paramMap.get('actName') || '';

    if (tournaId && activityName) {
      this.apollo
        .watchQuery<{ eventsByActivity: _Event[] }>({
          query: GET_EVENTS_BY_ACTIVITY,
          variables: { 
            tournamentId: Number(tournaId),
            activityName: activityName.toUpperCase()
          }
        })
        .valueChanges
        .subscribe({
          next: ({ data }) => {
            if (data && data.eventsByActivity) {
              this.events = data.eventsByActivity.map((event, index) => ({
                id: index + 1,
                name: event.name,
                activity: event.activity,
                gender: event.gender,
                weightClass: event.weightClass,
                ageGroup: event.ageGroup
              }));
              this.checkColumnData();
            } else {
              this.events = [];
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching events:', error);
            this.loading = false;
          }
        });
    } else {
      console.error('Tournament ID or activity name not found in route parameters');
      this.loading = false;
    }
  }

  checkColumnData(): void {
    this.hasName = this.events.some(event => event.name !== null && event.name !== undefined);
    this.hasGender = this.events.some(event => event.gender !== null && event.gender !== undefined);
    this.hasWeightClass = this.events.some(event => event.weightClass !== null && event.weightClass !== undefined);
    this.hasAgeGroup = this.events.some(event => event.ageGroup !== null && event.ageGroup !== undefined);
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToEvent(event: _Event) {
    const tournaSlug = this.route.snapshot.paramMap.get('tournaSlug');
    const tournaId = this.route.snapshot.paramMap.get('id');
    const actSlug = this.route.snapshot.paramMap.get('actName');
    
    // Build the category parts array
    const categoryParts = [];
    if (event.gender) categoryParts.push(event.gender);
    if (event.weightClass) categoryParts.push(event.weightClass);
    if (event.ageGroup) categoryParts.push(event.ageGroup);
    
    // Join the parts with hyphens and create slug
    const category = categoryParts.join('-');
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';

    this.router.navigate([tournaSlug, tournaId, actSlug, categorySlug], { relativeTo: this.route.root });
}

  toggleNewEvent(): void {
    this.newEventVisible = true;
  }

  addEvent(event: _Event): void {
    this.events = [...this.events, event];
    // Re-check column data after adding a new event
    this.checkColumnData();
  }
}