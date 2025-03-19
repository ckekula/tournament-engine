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
    { id: 1, name: 'Group A' },
    { id: 2, name: 'Group B' },
    { id: 3, name: 'Group C' },
    { id: 4, name: 'Group D' },
  ];

  get tabs() {
    return this.groups.map((group, index) => ({
      title: group.name,
      value: index,
      component: GroupComponent
    }));
  }

  addGroup(group: Group): void {
    this.groups = [...this.groups, group];
  }

  toggleNewGroup() {
    this.newGroupVisible = true;
  }
}
