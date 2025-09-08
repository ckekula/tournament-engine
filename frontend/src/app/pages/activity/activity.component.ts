import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { EventTableComponent } from '../../components/activity/event-table/event-table.component';
import { StandingsTableComponent } from '../../components/shared/standings-table/standings-table.component';
import { TabsComponent } from '../../components/shared/tabs/tabs.component';
import { TopThreeComponent } from "../../components/shared/top-three/top-three.component";

@Component({
  selector: 'app-activity',
  imports: [
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    EventTableComponent,
    StandingsTableComponent,
    TopThreeComponent
],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent {
  tabs = [
    { title: 'Standings', value: 0, component: StandingsTableComponent },
    { title: 'Events', value: 1, component: EventTableComponent },
  ];
}
