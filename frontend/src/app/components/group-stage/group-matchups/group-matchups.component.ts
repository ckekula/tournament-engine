import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Round, Team } from '../../../types/models';

@Component({
  selector: 'app-group-matchups',
  imports: [
    TableModule,
    CommonModule,
  ],
  templateUrl: './group-matchups.component.html',
  styleUrl: './group-matchups.component.scss'
})
export class GroupMatchupsComponent implements OnChanges {
  @Input() teams: Team[] = [];
  @Input() loading = false;
  
  // Output event to notify parent when rounds change
  @Output() roundsChanged = new EventEmitter<Round[]>();

  rounds: Round[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teams'] && this.teams.length > 0) {
      this.generateRounds();
    }
  }
  
  generateRounds(): void {
    if (this.teams.length < 2) {
      this.rounds = [];
      return;
    }

    // Generate all possible matchups between teams in this group
    const rounds: Round[] = [];
    
    // Create all possible combinations of teams
    for (let i = 0; i < this.teams.length; i++) {
      for (let j = i + 1; j < this.teams.length; j++) {
        rounds.push({
          team1Id: this.teams[i].id,
          team1Score: Math.floor(Math.random() * 31), // Random score 0-30 for demo
          team2Id: this.teams[j].id,
          team2Score: Math.floor(Math.random() * 31)  // Random score 0-30 for demo
        });
      }
    }
    
    this.rounds = rounds;
    
    // Notify parent component about rounds data
    this.roundsChanged.emit(this.rounds);
  }

  getTeamName(teamId: number): string {
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : `Unknown Team (${teamId})`;
  }
  
  updateScore(round: Round): void {
    // In a real app, you might want to validate inputs here
    // After scores update, emit event to recalculate stats
    this.roundsChanged.emit(this.rounds);
  }
}
