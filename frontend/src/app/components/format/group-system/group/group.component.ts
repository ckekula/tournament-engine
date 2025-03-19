import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GroupMatchupsComponent } from '../group-matchups/group-matchups.component';
import { Team } from '../../../../types/models';

@Component({
  selector: 'app-group',
  imports: [
    CommonModule, 
    GroupMatchupsComponent
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit {
  teams: Team[] = [
    { id: 1, name: 'Team A' },
    { id: 2, name: 'Team B' },
    { id: 3, name: 'Team C' },
    { id: 4, name: 'Team D' }
  ];

  // Loading state to be passed to children
  loading = false;

  ngOnInit(): void {
    // In a real application, you might fetch teams data from a service
    this.loading = true;
    // Simulate API call
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }
}
