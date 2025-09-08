import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { GroupMatchupsComponent } from '../group-matchups/group-matchups.component';
import { Team, Group } from '../../../../types/models';

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
  @Input() group?: Group;

  // Loading state to be passed to children
  loading = false;

  ngOnInit(): void {
    // In a real application, you might fetch teams data from a service
  }
}
