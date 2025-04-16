import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/shared/header/header.component";
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { TabsComponent } from "../../components/shared/tabs/tabs.component";
import { StandingsTableComponent } from '../../components/shared/standings-table/standings-table.component';
import { ActivityTableComponent } from '../../components/tournament/activity-table/activity-table.component';
import { TopThreeComponent } from '../../components/shared/top-three/top-three.component';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';
import { GET_TOURNAMENT } from '../../graphql/queries/tournament.query';
import { Tournament } from '../../types/tournament';
import { Organization } from '../../types/organization';

@Component({
  selector: 'app-tournament',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    StandingsTableComponent,
    ActivityTableComponent,
    TopThreeComponent
],
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.scss'
})
export class TournamentComponent implements OnInit {
  private apollo = inject(Apollo);
  private route = inject(ActivatedRoute);

  currentTourn!: Tournament;
  organizer!: Organization;

  ngOnInit(): void {
    const currentTournId = Number(this.route.snapshot.paramMap.get('id'));
    if (currentTournId) {
      this.apollo.watchQuery<{ tournament: Tournament }>({
        query: GET_TOURNAMENT,
        variables: { id: currentTournId }
      })
      .valueChanges
      .subscribe({
        next: ({ data }) => {
          this.currentTourn = data.tournament;
          this.organizer = data.tournament.organizer;
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
    { title: 'Sports', value: 1, component: ActivityTableComponent },
  ];
}
