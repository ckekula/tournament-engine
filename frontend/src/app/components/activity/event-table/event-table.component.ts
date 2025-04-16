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

  events: _Event [] = [
    { id: 1, name: null, gender: 'Men', weightClass: '55kg', ageGroup: null },
    { id: 2, name: null, gender: 'Men', weightClass: '67kg', ageGroup: null },
    { id: 3, name: null, gender: 'Men', weightClass: '73kg', ageGroup: null },
    { id: 4, name: null, gender: 'Men', weightClass: '81kg', ageGroup: null },     
    { id: 5, name: null, gender: 'Women', weightClass: '49kg', ageGroup: null },
    { id: 6, name: null, gender: 'Women', weightClass: '55kg', ageGroup: null }, 
    { id: 7, name: null, gender: 'Women', weightClass: '59kg', ageGroup: null },
    { id: 8, name: null, gender: 'Women', weightClass: '64kg', ageGroup: null },  
  ];

  hasGenderData: boolean = false;
  hasWeightClassData: boolean = false;
  hasAgeGroupData: boolean = false;

  selectedEvent!: _Event;
  loading: boolean = false;
  newEventVisible = false;

  ngOnInit(): void {
    this.checkColumnData();
  }

  checkColumnData(): void {
    this.hasGenderData = this.events.some(event => event.gender !== null && event.gender !== undefined);
    this.hasWeightClassData = this.events.some(event => event.weightClass !== null && event.weightClass !== undefined);
    this.hasAgeGroupData = this.events.some(event => event.ageGroup !== null && event.ageGroup !== undefined);
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToEvent(category: string) {
    const tournaSlug = this.route.snapshot.paramMap.get('tournaSlug');
    const tournaId = this.route.snapshot.paramMap.get('id');
    const actSlug = this.route.snapshot.paramMap.get('actSlug');
    const categorySlug = category?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';

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