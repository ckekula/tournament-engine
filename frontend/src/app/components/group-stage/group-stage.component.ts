import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../types/models';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../shared/tabs/tabs.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupService } from '../../services/group.service';
import { SingleEliminationComponent } from '../format/single-elimination/single-elimination.component';
import { StandingsTableComponent } from '../shared/standings-table/standings-table.component';
import { RoundRobinComponent } from '../format/round-robin/round-robin.component';

@Component({
  selector: 'app-group-stage',
  imports: [
    CommonModule, 
    TabsComponent,
    AddGroupComponent
  ],
  templateUrl: './group-stage.component.html',
  styleUrl: './group-stage.component.scss'
})
export class GroupStageComponent implements OnInit {
  @Input() groupStageId!: number;
  newGroupVisible = false;
  groups: Group[] = []
  
  constructor(
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.groupService.getByGroupStage(this.groupStageId).subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (err) => {
        console.error('Error fetching stages:', err);
      }
    });
  }

  private getComponent(format: string) {
    const componentMap: { [key: string]: any } = {
      'Single Elimination': SingleEliminationComponent,
      'Double Elimination': StandingsTableComponent,
      'Round Robin': RoundRobinComponent,
    };
    return componentMap[format] || RoundRobinComponent;
  }

  get tabs() {
    return this.groups.map((group, index) => ({
      title: group.name,
      value: index,
      component: this.getComponent(group.groupStage.format),
      inputs: { group: group }
    }));
  }

  addGroup(group: Group): void {
    this.groups = [...this.groups, group];
  }

  toggleNewGroup() {
    this.newGroupVisible = true;
  }
}
