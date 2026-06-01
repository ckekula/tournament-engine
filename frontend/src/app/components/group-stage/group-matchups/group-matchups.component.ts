import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Group, GroupStageParticipant, Round } from '../../../types/models';

@Component({
  selector: 'app-group-matchups',
  imports: [
    TableModule,
    CommonModule,
  ],
  templateUrl: './group-matchups.component.html',
  styleUrl: './group-matchups.component.scss'
})
export class GroupMatchupsComponent implements OnInit {
  @Input() group!: Group;
  @Input() loading = false;

  groupParticipants: GroupStageParticipant[] = [];
  
  // Output event to notify parent when rounds change
  @Output() roundsChanged = new EventEmitter<Round[]>();
  rounds: Round[] = [];

  ngOnInit() {
    this.groupParticipants = this.group.groupParticipants || [];
    this.generateRounds();
  }

  generateRounds(): void {
    if (this.groupParticipants.length < 2) {
      this.rounds = [];
      return;
    }

    // Generate all possible matchups between participants in this group
    const rounds: Round[] = [];
    
    // Create all possible combinations of participants
    for (let i = 0; i < this.groupParticipants.length; i++) {
      for (let j = i + 1; j < this.groupParticipants.length; j++) {
        rounds.push({
          participant1Id: this.groupParticipants[i].id,
          participant1Score: Math.floor(Math.random() * 31),
          participant2Id: this.groupParticipants[j].id,
          participant2Score: Math.floor(Math.random() * 31)
        });
      }
    }
    
    this.rounds = rounds;
    
    // Notify parent component about rounds data
    this.roundsChanged.emit(this.rounds);
  }
  
  getParticipantName(participantId: number): string {
    const participant = this.groupParticipants.find(p => p.id === participantId);
    if (!participant) {
      return `Unknown Participant (${participantId})`;
    }
    
    if ('name' in participant) {
      return (participant as any).name;
    }
    
    if ('person' in participant) {
      return (participant as any).person.name;
    }
    
    return `Unknown Participant (${participantId})`;
  }
  
  updateScore(): void {
    this.roundsChanged.emit(this.rounds);
  }
}