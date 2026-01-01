import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { RegisteredOrgTableComponent } from '../../components/tournament/registered-org-table/registered-org-table.component';
import { ActivatedRoute } from '@angular/router';
import { TournamentService } from '../../services/tournament.service';

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
    TopThreeComponent,
    RegisteredOrgTableComponent
  ],
  templateUrl: './tournament.component.html',
  styleUrl: './tournament.component.scss',
})
export class TournamentComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService
  ) {}
  tournaRegisterVisible = false;
  tournamentName!: string

  ngOnInit(): void {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    this.tournamentService.getOne(tournamentId).subscribe({
      next: (tournament) => {
        tournament = tournament;
        this.tournamentName = tournament.name
      },
      error: (err) => {
        console.error('Failed to load tournament', err);
      }
    });
  }

  tabs = [
    { title: 'Standings', value: 0, component: StandingsTableComponent },
    { title: 'Sports', value: 1, component: ActivityTableComponent },
    { title: 'Registered Organizations', value: 2, component: RegisteredOrgTableComponent },
  ];

  toggleRegister() {
    this.tournaRegisterVisible = true;
  }

}
