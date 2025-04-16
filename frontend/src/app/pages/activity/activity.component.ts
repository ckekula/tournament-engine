import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { EventTableComponent } from '../../components/activity/event-table/event-table.component';
import { StandingsTableComponent } from '../../components/shared/standings-table/standings-table.component';
import { TabsComponent } from '../../components/shared/tabs/tabs.component';
import { TopThreeComponent } from "../../components/shared/top-three/top-three.component";
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { Tournament } from '../../types/tournament';
import { Activity } from '../../types/activity';
import { GET_ACTIVITY } from '../../graphql/queries/activity.query';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    TabsComponent,
    EventTableComponent,
    StandingsTableComponent,
    TopThreeComponent
],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  private apollo = inject(Apollo);
  private route = inject(ActivatedRoute);

  currentActivity!: Activity;
  tournament!: Tournament;

  ngOnInit(): void {
    const currentActivityId = Number(this.route.snapshot.paramMap.get('id'));
    if (currentActivityId) {
      this.apollo.watchQuery<{ activity: Activity }>({
        query: GET_ACTIVITY,
        variables: { id: currentActivityId }
      })
      .valueChanges
      .subscribe({
        next: ({ data }) => {
          this.currentActivity = data.activity;
          this.tournament = data.activity.tournament;
        },
        error: (error) => {
          console.error('Error fetching organization:', error);
        }
      });
    } else {
      // handle unauthenticated case
      console.warn('Route Param note found.');
    }
  };

  tabs = [
    { title: 'Standings', value: 0, component: StandingsTableComponent },
    { title: 'Events', value: 1, component: EventTableComponent },
  ];
}
