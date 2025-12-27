import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { TabsComponent } from '../../../components/shared/tabs/tabs.component';
import { ButtonModule } from 'primeng/button';
import { OrgTeamTableComponent } from '../../../components/tournament/tourna-org/org-team-table/org-team-table.component';
import { OrgParticipantTableComponent } from '../../../components/tournament/tourna-org/org-participant-table/org-participant-table.component';

@Component({
  selector: 'app-tourna-org',
  imports: [
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    ButtonModule
  ],
  templateUrl: './tourna-org.component.html',
  styleUrl: './tourna-org.component.scss'
})
export class TournaOrgComponent {
  tabs = [
    { title: 'Teams', value: 0, component: OrgTeamTableComponent },
    { title: 'Participants', value: 1, component: OrgParticipantTableComponent }
  ];
}
