import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon'; 
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../../../types/models';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'app-activity-table',
  imports: [
    TableModule, 
    TagModule, 
    IconFieldModule, 
    InputTextModule, 
    InputIconModule, 
    MultiSelectModule, 
    SelectModule, 
    AddActivityComponent
  ],
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss'
})
export class ActivityTableComponent implements OnInit {

  activities: Activity [] = []
  selectedActivity!: Activity;
  newActivityVisible = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    const tournaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.activityService.getByTournament(tournaId).subscribe({
      next: (activities) => {
        this.activities = activities;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
        this.loading = false;
      }
    });
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToActivity(activityName: string) {
    const tournaSlug = this.route.snapshot.paramMap.get('slug');
    const tournaId = this.route.snapshot.paramMap.get('id');
    const actName = activityName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    this.router.navigate([tournaSlug, tournaId, actName], { relativeTo: this.route.root });
  }

  toggleNewActivity(): void {
    this.newActivityVisible = true;
  }

  addActivity(activity: Activity): void {
    this.activities = [...this.activities, activity];
  }
}
