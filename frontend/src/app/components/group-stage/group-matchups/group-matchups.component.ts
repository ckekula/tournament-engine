import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

interface Participant {
  id: number;
  events: any[];
}

interface Team extends Participant {
  name: string;
  organization: any;
  members?: TeamMember[];
}

interface TeamMember {
  id: number;
  person: Person;
  team: Team;
}

interface Person {
  name: string;
}

interface Round {
  participant1Id: number;
  participant1Score: number;
  participant2Id: number;
  participant2Score: number;
}

@Component({
  selector: 'app-group-matchups',
  imports: [
    TableModule,
    CommonModule,
  ],
  templateUrl: './group-matchups.component.html',
  styleUrl: './group-matchups.component.scss'
})
export class GroupMatchupsComponent implements OnInit, OnChanges {
  @Input() participants: Participant[] = [];
  @Input() loading = false;
  
  // Output event to notify parent when rounds change
  @Output() roundsChanged = new EventEmitter<Round[]>();
  rounds: Round[] = [];

ngOnInit() {
  // Load 6 dummy participants
  this.loadDummyData(4);
}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['participants'] && this.participants.length > 0) {
      this.generateRounds();
    }
  }
  
  // Generate dummy participants for testing
  generateDummyParticipants(count: number = 4): Participant[] {
    const dummyParticipants: Team[] = [];
    const teamNames = [
    'University of Colombo',
    'University of Ruhuna',
    'University of Peradeniya',
    'University of Moratuwa',
    'University of Sri Jayewardenepura',
    'University of Kelaniya',
    'University of Jaffna',
    'University of Uva Wellassa',
    'University of Rajarata',
    'University of Wayamba',
    'University of Southe Eastern',
    'University of Sabaragamuwa',
    'University of Eastern',
    
    ];
    
    const organizations = [
      'Alpha Org', 'Beta Gaming', 'Gamma Corps', 'Delta Force',
      'Epsilon Elite', 'Zeta Zone', 'Eta Esports', 'Theta Team'
    ];
    
    for (let i = 0; i < Math.min(count, teamNames.length); i++) {
      dummyParticipants.push({
        id: i + 1,
        name: teamNames[i],
        organization: { name: organizations[i % organizations.length] },
        events: [],
        members: []
      });
    }
    
    return dummyParticipants;
  }
  
  // Call this method to load dummy data
  loadDummyData(participantCount: number = 6): void {
    this.participants = this.generateDummyParticipants(participantCount);
    this.generateRounds();
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
          participant1Score: Math.floor(Math.random() * 31),
          participant2Id: this.participants[j].id,
          participant2Score: Math.floor(Math.random() * 31)
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
    
    if ('name' in participant) {
      return (participant as any).name;
    }
    
    if ('person' in participant) {
      return (participant as any).person.name;
    }
    
    return `Unknown Participant (${participantId})`;
  }
  
  updateScore(round: Round): void {
    this.roundsChanged.emit(this.rounds);
  }
}