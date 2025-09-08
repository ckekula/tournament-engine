import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { StandingsTableComponent } from '../../components/shared/standings-table/standings-table.component';
import { StageTabsComponent } from "../../components/event/stage-tabs/stage-tabs.component";
import { TabsComponent } from '../../components/shared/tabs/tabs.component';
import { TopThreeComponent } from '../../components/shared/top-three/top-three.component';

@Component({
  selector: 'app-event',
  imports: [
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    StandingsTableComponent,
    StageTabsComponent,
    TopThreeComponent
  ],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent {
  tabs = [
    { title: 'Standings', value: 0, component: StandingsTableComponent },
    { title: 'Stages', value: 1, component: StageTabsComponent },
  ];
}
