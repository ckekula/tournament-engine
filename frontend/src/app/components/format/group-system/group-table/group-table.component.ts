import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Round, Team, TeamStats } from '../../../../types/models';

@Component({
  selector: 'app-group-table',
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './group-table.component.html',
  styleUrl: './group-table.component.scss'
})
export class GroupTableComponent implements OnChanges {
  @Input() teams: Team[] = [];
  @Input() rounds: Round[] = [];
  @Input() loading = false;
  
  teamsStats: TeamStats[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['teams'] || changes['rounds']) && 
        this.teams.length > 0 && 
        this.rounds.length > 0) {
      this.calculateTeamStats();
    }
  }

  calculateTeamStats(): void {
    const teamsStatsMap: Record<number, TeamStats> = {};
    
    // Initialize stats for all teams
    this.teams.forEach(team => {
      teamsStatsMap[team.id] = { 
        teamId: team.id, 
        teamName: team.name,
        wins: 0, 
        losses: 0, 
        ties: 0, 
        points: 0, 
        scoreDiff: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        played: 0
      };
    });
    
    // Calculate stats based on rounds
    this.rounds.forEach(({ team1Id, team1Score, team2Id, team2Score }) => {
      // Ensure both teams exist in the map
      if (!teamsStatsMap[team1Id] || !teamsStatsMap[team2Id]) {
        return;
      }
      
      // Update games played
      teamsStatsMap[team1Id].played++;
      teamsStatsMap[team2Id].played++;
      
      // Update goals
      teamsStatsMap[team1Id].goalsFor += team1Score;
      teamsStatsMap[team1Id].goalsAgainst += team2Score;
      teamsStatsMap[team2Id].goalsFor += team2Score;
      teamsStatsMap[team2Id].goalsAgainst += team1Score;

      // Update wins, losses, ties, and score diff
      if (team1Score > team2Score) {
        // Team 1 wins
        teamsStatsMap[team1Id].wins++;
        teamsStatsMap[team2Id].losses++;
      } else if (team1Score < team2Score) {
        // Team 2 wins  
        teamsStatsMap[team2Id].wins++;
        teamsStatsMap[team1Id].losses++;
      } else {
        // Tie
        teamsStatsMap[team1Id].ties++;
        teamsStatsMap[team2Id].ties++;
      }
      
      // Update score differential
      teamsStatsMap[team1Id].scoreDiff += team1Score - team2Score;
      teamsStatsMap[team2Id].scoreDiff += team2Score - team1Score;
    });
    
    // Calculate points and convert to array
    this.teamsStats = Object.values(teamsStatsMap).map(stats => ({
      ...stats,
      points: stats.wins * 3 + stats.ties
    }));
    
    // Sort by points (descending), then by score diff (descending)
    this.teamsStats.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.scoreDiff - a.scoreDiff;
    });
  }
}
