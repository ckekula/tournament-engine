import { Component } from '@angular/core';
import { OrgChartComponent } from '../org-chart/org-chart.component';

@Component({
  selector: 'app-single-elimination',
  imports: [
    OrgChartComponent
  ],
  templateUrl: './single-elimination.component.html',
  styleUrl: './single-elimination.component.scss'
})
export class SingleEliminationComponent {

  data = [
    { id: 1, name: 'Finals', parentId: null },
    { id: 2, name: 'Semi-Final 1', parentId: 1 },
    { id: 3, name: 'Semi-Final 2', parentId: 1 },
    { id: 4, name: 'Quarter-Final 1', parentId: 2 },
    { id: 5, name: 'Quarter-Final 2', parentId: 2 },
    { id: 6, name: 'Quarter-Final 3', parentId: 3 },
    { id: 7, name: 'Quarter-Final 4', parentId: 3 },
  ];
}
