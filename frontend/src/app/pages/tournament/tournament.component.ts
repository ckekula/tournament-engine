import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/shared/header/header.component";
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { TabsComponent } from "../../components/shared/tabs/tabs.component";
import { StandingsTableComponent } from '../../components/shared/standings-table/standings-table.component';
import { ActivityTableComponent } from '../../components/tournament/activity-table/activity-table.component';
import { TopThreeComponent } from '../../components/shared/top-three/top-three.component';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { TournaRegisterComponent } from '../../components/tournament/tourna-register/tourna-register.component';

@Component({
  selector: 'app-tournament',
  imports: [
    DialogModule,
    CommonModule,
    RippleModule,
    ButtonModule,
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    StandingsTableComponent,
    ActivityTableComponent,
    TournaRegisterComponent,
    TopThreeComponent],
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.scss',
})
export class TournamentComponent {
  tournaRegisterVisible = false;

  tabs = [
    { title: 'Standings', value: 0, component: StandingsTableComponent },
    { title: 'Sports', value: 1, component: ActivityTableComponent },
  ];

  toggleRegister() {
    this.tournaRegisterVisible = true;
  }

}
