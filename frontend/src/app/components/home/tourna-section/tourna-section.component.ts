import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tournament } from '../../../types/models';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TournaCardComponent } from '../../organization/tourna-card/tourna-card.component';
import { TournamentService } from '../../../services/tournament.service';

@Component({
  selector: 'app-tourna-section',
  imports: [
    CommonModule,
    ButtonModule,
    TournaCardComponent
  ],
  templateUrl: './tourna-section.component.html',
  styleUrl: './tourna-section.component.scss'
})
export class TournaSectionComponent {
 
  constructor(
    private router: Router,
    private tournamentService: TournamentService
  ) {}

  tournaments: Tournament[] = [];

  ngOnInit(): void {    
    this.tournamentService.getAll().subscribe({
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
    this.router.navigate([`${tournaId}/${tournaAbb}`]);
  }
}
