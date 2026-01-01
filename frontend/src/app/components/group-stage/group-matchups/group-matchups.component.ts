import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Round, Participant } from '../../../types/models';

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
  @Input() participants: Participant[] = [];
  @Input() loading = false;
  
  // Output event to notify parent when rounds change
  @Output() roundsChanged = new EventEmitter<Round[]>();

  rounds: Round[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participants'] && this.participants.length > 0) {
      this.generateRounds();
    }
  }
  
  generateRounds(): void {
    if (this.participants.length < 2) {
      this.rounds = [];
      return;
    }

    // Generate all possible matchups between participants in this group
    const rounds: Round[] = [];
    
    // Create all possible combinations of participants
    for (let i = 0; i < this.participants.length; i++) {
      for (let j = i + 1; j < this.participants.length; j++) {
        rounds.push({
          participant1Id: this.participants[i].id,
          participant1Score: Math.floor(Math.random() * 31), // Random score 0-30 for demo
          participant2Id: this.participants[j].id,
          participant2Score: Math.floor(Math.random() * 31)  // Random score 0-30 for demo
        });
      }
    }
    
    this.rounds = rounds;
    
    // Notify parent component about rounds data
    this.roundsChanged.emit(this.rounds);
  }

  getParticipantName(participantId: number): string {
    const participant = this.participants.find(p => p.id === participantId);
    if (!participant) {
      return `Unknown Participant (${participantId})`;
    }
    
    // Type guard to check if it's a Team
    if ('name' in participant) {
      return (participant as any).name;
    }
    // Type guard to check if it's an Individual
    if ('person' in participant) {
      return (participant as any).person.name;
    }
    
    return `Unknown Participant (${participantId})`;
  }
  
  updateScore(round: Round): void {
    // In a real app, you might want to validate inputs here
    // After scores update, emit event to recalculate stats
    this.roundsChanged.emit(this.rounds);
  }
}