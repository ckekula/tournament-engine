import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandingsTableComponent } from '../../shared/standings-table/standings-table.component';
import { TabsComponent } from '../../shared/tabs/tabs.component';
import { AddStageComponent } from '../add-stage/add-stage.component';
import { Stage } from '../../../types/models';
import { GroupSystemComponent } from '../../format/group-system/group-system.component';
import { SingleEliminationComponent } from '../../format/single-elimination/single-elimination.component';
import { ActivatedRoute } from '@angular/router';
import { StageService } from '../../../services/stage.service';

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
export class StageTabsComponent implements OnInit {
  newStageVisible = false;
  stages: Stage[] = [];

  constructor(
    private route: ActivatedRoute,
    private stageService: StageService
  ) {}

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.stageService.getByEvent(eventId).subscribe({
      next: (stages) => {
        this.stages = stages;
      },
      error: (err) => {
        console.error('Error fetching stages:', err);
      }
    });
  }

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
