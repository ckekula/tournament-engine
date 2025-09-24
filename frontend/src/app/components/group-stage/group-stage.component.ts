import { Component, Input, OnInit } from '@angular/core';
import { Group } from '../../types/models';
import { GroupComponent } from '../format/group-system/group/group.component';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../shared/tabs/tabs.component';
import { AddGroupComponent } from './add-group/add-group.component';
import { GroupService } from '../../services/group.service';

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
  groups: Group[] = [
    { 
      id: 1, 
      name: 'Group A',
      teams: [
        { id: 1, name: 'AA' },
        { id: 2, name: 'AB' },
        { id: 3, name: 'AC' },
        { id: 4, name: 'AD' }
      ]
    },
    { 
      id: 2, 
      name: 'Group B',
      teams: [
        { id: 5, name: 'BA' },
        { id: 6, name: 'BB' },
        { id: 7, name: 'BC' },
        { id: 8, name: 'BD' }
      ]
    },
    { 
      id: 3, 
      name: 'Group C',
      teams: [
        { id: 9, name: 'CA' },
        { id: 10, name: 'CB' },
        { id: 11, name: 'CC' },
        { id: 12, name: 'CD' }
      ]
    },
    { 
      id: 4, 
      name: 'Group D',
      teams: [
        { id: 13, name: 'DA' },
        { id: 14, name: 'DB' },
        { id: 15, name: 'DC' },
        { id: 16, name: 'DD' }
      ]
    },
  ];
  
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

  get tabs() {
    return this.groups.map((group, index) => ({
      title: group.name,
      value: index,
      component: GroupComponent,
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
