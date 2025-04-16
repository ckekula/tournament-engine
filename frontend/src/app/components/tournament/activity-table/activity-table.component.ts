import { Component, inject } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity } from '../../../types/activity';
import { AddActivityComponent } from '../add-activity/add-activity.component';
import { Apollo } from 'apollo-angular';
import { GET_ACTIVITIES_BY_TOURN } from '../../../graphql/queries/activity.query';

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
    CommonModule,
    AddActivityComponent
  ],
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss'
})
export class ActivityTableComponent {
  private apollo = inject(Apollo);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  activities: Activity[] = [];
  selectedActivity!: Activity;
  loading: boolean = false;
  newActivityVisible = false;

  ngOnInit(): void {
    const tournaId = this.route.snapshot.paramMap.get('id');
    if (tournaId) {
      this.apollo
        .watchQuery<{ activitiesByTournament: Activity[] }>({
          query: GET_ACTIVITIES_BY_TOURN,
          variables: { tournaId: Number(tournaId) }
        })
        .valueChanges
        .subscribe({
          next: ({ data }) => {
            if (data && data.activitiesByTournament) {
              this.activities = data.activitiesByTournament.map((activity, index) => ({
                id: index + 1,
                name: activity.name,
                tournament: activity.tournament,
              }));
            } else {
              this.activities = [];
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching activities:', error);
            this.loading = false;
          }
        });
    } else {
      console.error('Tournament ID not found in route parameters');
      this.loading = false;
    }
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
    // Generate a new ID for the activity (next available ID)
    const newId = this.activities.length > 0 ? 
      Math.max(...this.activities.map(a => a.id)) + 1 : 1;
    
    const newActivity = {
      ...activity,
      id: newId
    };
    
    this.activities = [...this.activities, newActivity];
  }
}
