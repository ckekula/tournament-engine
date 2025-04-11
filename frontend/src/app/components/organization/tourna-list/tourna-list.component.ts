import { Component, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Tournament } from '../../../types/tournament';
import { GET_TOURNAMENTS_BY_ORG } from '../../../graphql/queries/tournament.query';
import { GET_ORGANIZATION } from '../../../graphql/queries/organization.query';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AddTournaComponent } from '../add-tourna/add-tourna.component';
import { TournaCardComponent } from '../tourna-card/tourna-card.component';
import { Organization } from '../../../types/organization';

@Component({
  selector: 'app-tourna-list',
  imports: [
    CommonModule,
    ButtonModule,
    AddTournaComponent,
    TournaCardComponent
  ],
  templateUrl: './tourna-list.component.html',
  styleUrl: './tourna-list.component.scss'
})
export class TournaListComponent {
  private apollo = inject(Apollo);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tournaments: Tournament[] = [];
  newTournaVisible = false;
  currentOrg!: Organization;

  ngOnInit(): void {
    const currentOrgId = Number(this.route.snapshot.paramMap.get('id'));
    if (currentOrgId) {

      this.apollo
      .watchQuery<{ organization: Organization }>({
        query: GET_ORGANIZATION,
        variables: { id: currentOrgId }
      })
      .valueChanges
      .subscribe({
        next: ({ data }) => {
          this.currentOrg = data.organization;
        },
        error: (error) => {
          console.error('Error fetching organization:', error);
        }
      });
      this.apollo
        .watchQuery<{ tournamentsByOrg: Tournament[] }>({
          query: GET_TOURNAMENTS_BY_ORG,
          variables: { userId: currentOrgId }
        })
        .valueChanges
        .subscribe(({ data }) => {
          this.tournaments = data.tournamentsByOrg;
        });
    } else {
      // handle unauthenticated case
      console.warn('Route Param note found.');
    }
  }

  toggleNewTournament(): void {
    this.newTournaVisible = true;
  }

  addTournament(tourna: Tournament): void {
    this.tournaments = [...this.tournaments, tourna];
  }

  navigateToTourna(tournaAbb: string, tournaId: number): void {
    this.router.navigate(['/', tournaAbb, tournaId]);
  }
}
