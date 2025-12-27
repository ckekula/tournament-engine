import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon'; 
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Team } from '../../../../types/models';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../../services/participant.service';
import { AddTeamComponent } from '../add-team/add-team.component';

@Component({
  selector: 'app-org-team-table',
  imports: [
    TableModule, 
    TagModule, 
    IconFieldModule, 
    InputTextModule, 
    InputIconModule, 
    MultiSelectModule,
    SelectModule,
    AddTeamComponent
  ],
  templateUrl: './org-team-table.component.html',
  styleUrl: './org-team-table.component.scss'
})
export class OrgTeamTableComponent implements OnInit {
  teams: Team[] = []
  selectedTeam!: Team;
  newTeamVisible = false;
  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    const tournaId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    // this.loading = true;
    // this.participantService.getByOrgTourna(tournaId).subscribe({
    //   next: (activities) => {
    //     this.activities = activities;
    //     this.loading = false;
    //   },
    //   error: (err) => {
    //     console.error('Error fetching activities:', err);
    //     this.loading = false;
    //   }
    // });
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToTeam(teamId: number, teamName: string) {
    const teamSlug = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    this.router.navigate([`${teamId}/${teamSlug}`], { relativeTo: this.route });
  }

  toggleNewTeam(): void {
    this.newTeamVisible = true;
  }

  addTeam(team: Team): void {
    this.teams = [...this.teams, team];
  }
}
