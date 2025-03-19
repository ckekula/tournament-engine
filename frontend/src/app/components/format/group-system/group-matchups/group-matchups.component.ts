import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Round, Team } from '../../../../types/models';
import { GroupTableComponent } from '../group-table/group-table.component';

@Component({
  selector: 'app-group-matchups',
  imports: [
    TableModule,
    CommonModule,
    GroupTableComponent
  ],
  templateUrl: './group-matchups.component.html',
  styleUrl: './group-matchups.component.scss'
})
export class GroupMatchupsComponent implements OnChanges {
  @Input() teams: Team[] = [];
  @Input() loading = false;
  
  // Output event to notify parent when rounds change
  @Output() roundsChanged = new EventEmitter<Round[]>();

    // This component now manages the rounds
  rounds: Round[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['teams'] && this.teams.length > 0) {
      this.generateRounds();
    }
  }
  
  generateRounds(): void {
    // Generate all possible matchups between teams
    this.rounds = [
      { team1Id: 1, team1Score: 20, team2Id: 3, team2Score: 10 },
      { team1Id: 2, team1Score: 0, team2Id: 4, team2Score: 0 },
      { team1Id: 1, team1Score: 10, team2Id: 4, team2Score: 10 },
      { team1Id: 2, team1Score: 30, team2Id: 3, team2Score: 20 },
      { team1Id: 1, team1Score: 20, team2Id: 2, team2Score: 0 },
      { team1Id: 3, team1Score: 10, team2Id: 4, team2Score: 30 }
    ];
    
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
