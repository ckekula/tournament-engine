import { Component, Input } from '@angular/core';
import { Group } from '../../../types/models';
import { GroupMatchupsComponent } from '../group-system/group-matchups/group-matchups.component';

@Component({
  selector: 'app-round-robin',
  imports: [
    GroupMatchupsComponent
  ],
  templateUrl: './round-robin.component.html',
  styleUrl: './round-robin.component.scss'
})
export class RoundRobinComponent {
  @Input() group?: Group;

  // Loading state to be passed to children
  loading = false;

  ngOnInit(): void {
    // In a real application, you might fetch teams data from a service
  }
}
