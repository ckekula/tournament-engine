import { Component } from '@angular/core';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { CommonModule } from '@angular/common';
import { Group } from '../../../types/models';
import { GroupComponent } from './group/group.component';
import { AddGroupComponent } from './add-group/add-group.component';

@Component({
  selector: 'app-group-system',
  imports: [
    CommonModule, 
    TabsComponent,
    AddGroupComponent
  ],
  templateUrl: './group-system.component.html',
  styleUrl: './group-system.component.scss'
})
export class GroupSystemComponent {
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
