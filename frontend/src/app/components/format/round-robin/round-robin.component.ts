import { Component, Input, SimpleChanges } from '@angular/core';
import { Group, Round, Participant, ParticipantStats, StageParticipant, GroupStageParticipant } from '../../../types/models';
import { GroupMatchupsComponent } from '../../group-stage/group-matchups/group-matchups.component';
import { GroupStandingsTableComponent } from '../../group-stage/group-standings-table/group-standings-table.component';

@Component({
  selector: 'app-round-robin',
  imports: [
    GroupStandingsTableComponent,
    GroupMatchupsComponent
  ],
  templateUrl: './round-robin.component.html',
  styleUrl: './round-robin.component.scss'
})
export class RoundRobinComponent {
  @Input() group?: Group;
  @Input() participants: GroupStageParticipant[] = [];
  @Input() rounds: Round[] = [];

  loadingMatchups = false;
  loadingStandings = false;

  participantsStats: ParticipantStats[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['participants'] || changes['rounds']) && 
        this.participants.length > 0 && 
        this.rounds.length > 0) {
      this.calculateParticipantStats();
    }
  }

  calculateParticipantStats(): void {
    const participantsStatsMap: Record<number, ParticipantStats> = {};
    
    // Initialize stats for all participants
    this.participants.forEach(participant => {
      participantsStatsMap[participant.id] = { 
        participantId: participant.id, 
        participantName: this.getParticipantName(participant),
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
    this.rounds.forEach(({ participant1Id, participant1Score, participant2Id, participant2Score }) => {
      // Ensure both participants exist in the map
      if (!participantsStatsMap[participant1Id] || !participantsStatsMap[participant2Id]) {
        return;
      }
      
      // Update games played
      participantsStatsMap[participant1Id].played++;
      participantsStatsMap[participant2Id].played++;
      
      // Update goals
      participantsStatsMap[participant1Id].goalsFor += participant1Score;
      participantsStatsMap[participant1Id].goalsAgainst += participant2Score;
      participantsStatsMap[participant2Id].goalsFor += participant2Score;
      participantsStatsMap[participant2Id].goalsAgainst += participant1Score;

      // Update wins, losses, ties, and score diff
      if (participant1Score > participant2Score) {
        // Participant 1 wins
        participantsStatsMap[participant1Id].wins++;
        participantsStatsMap[participant2Id].losses++;
      } else if (participant1Score < participant2Score) {
        // Participant 2 wins  
        participantsStatsMap[participant2Id].wins++;
        participantsStatsMap[participant1Id].losses++;
      } else {
        // Tie
        participantsStatsMap[participant1Id].ties++;
        participantsStatsMap[participant2Id].ties++;
      }
      
      // Update score differential
      participantsStatsMap[participant1Id].scoreDiff += participant1Score - participant2Score;
      participantsStatsMap[participant2Id].scoreDiff += participant2Score - participant1Score;
    });
    
    // Calculate points and convert to array
    this.participantsStats = Object.values(participantsStatsMap).map(stats => ({
      ...stats,
      points: stats.wins * 3 + stats.ties
    }));
    
    // Sort by points (descending), then by score diff (descending)
    this.participantsStats.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.scoreDiff - a.scoreDiff;
    });
  }

  private getParticipantName(participant: GroupStageParticipant): string {
    // Type guard to check if it's a Team
    if ('name' in participant) {
      return (participant as any).name;
    }
    // Type guard to check if it's an Individual
    if ('person' in participant) {
      return (participant as any).person.name;
    }
    return 'Unknown Participant';
  }
}