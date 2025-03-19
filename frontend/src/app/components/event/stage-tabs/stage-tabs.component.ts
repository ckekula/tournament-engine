import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingsTableComponent } from '../../shared/standings-table/standings-table.component';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { AddStageComponent } from '../add-stage/add-stage.component';
import { Stage } from '../../../types/models';
import { GroupSystemComponent } from '../../format/group-system/group-system.component';
import { SingleEliminationComponent } from '../../format/single-elimination/single-elimination.component';

@Component({
  selector: 'app-stage-tabs',
  imports: [
    CommonModule,
    TabsComponent,
    AddStageComponent,
    GroupSystemComponent,
    SingleEliminationComponent
],
  templateUrl: './stage-tabs.component.html',
  styleUrl: './stage-tabs.component.scss'
})
export class StageTabsComponent {
  newStageVisible = false;

  stages: Stage[] = [
    { id: 1, name: 'Group Stage', format: 'Group System' },
    { id: 2, name: 'Knockout Stage', format: 'Single Elimination' },
  ];

  private getComponentForFormat(format: string) {
    const componentMap: { [key: string]: any } = {
      'Group System': GroupSystemComponent,
      'Single Elimination': SingleEliminationComponent,
      'Double Elimination': StandingsTableComponent,
      'Round Robin': StandingsTableComponent,
    };
    return componentMap[format] || StandingsTableComponent;
  }

  get tabs() {
    return this.stages.map((stage, index) => ({
      title: stage.name,
      value: index,
      component: this.getComponentForFormat(stage.format)
    }));
  }

  addStage(stage: Stage): void {
    this.stages = [...this.stages, stage];
  }

  toggleNewStage() {
    this.newStageVisible = true;
  }
}
