import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from '../../../types/models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AddTournaComponent } from '../add-tourna/add-tourna.component';
import { TournaCardComponent } from '../tourna-card/tourna-card.component';
import { TournamentService } from '../../../services/tournament.service';

@Component({
  selector: 'app-tourna-section',
  imports: [
    CommonModule,
    ButtonModule,
    AddTournaComponent,
    TournaCardComponent
  ],
  templateUrl: './tourna-section.component.html',
  styleUrl: './tourna-section.component.scss'
})
export class TournaSectionComponent implements OnInit {
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) {}

  tournaments: Tournament[] = [];

  ngOnInit(): void {
    const organizerId = Number(this.route.snapshot.paramMap.get('id'));
    this.tournamentService.getByOrganization(organizerId).subscribe({
      next: (tournaments) => {
        this.tournaments = tournaments;
      },
      error: (err) => {
        console.error('Error fetching tournaments:', err);
      }
    });
  }

  newTournaVisible = false;

  toggleNewTourna(): void {
    this.newTournaVisible = true;
  }

  addTournament(tournament: Tournament): void {
    this.tournaments = [...this.tournaments, tournament];
  }

  navigateToTourna(tournaAbb: string, tournaId: number) {
    this.router.navigate([`${tournaAbb}/${tournaId}`]);
  }
}
