import { Component, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon'; 
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Organization } from '../../../types/models';
import { TournamentService } from '../../../services/tournament.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registered-org-table',
  imports: [
    TableModule,
    TagModule, 
    IconFieldModule, 
    InputTextModule, 
    InputIconModule, 
    MultiSelectModule, 
    SelectModule, 
  ],
  templateUrl: './registered-org-table.component.html',
  styleUrl: './registered-org-table.component.scss'
})
export class RegisteredOrgTableComponent implements OnInit {
  selectedOrg!: Organization;
  registeredOrgs: Organization[] =  []
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tournamentService: TournamentService
  ) {}

  ngOnInit(): void {
    const tournaId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    this.loading = true;
    this.tournamentService.getRegisteredOrgs(tournaId).subscribe({
      next: (organization) => {
        this.registeredOrgs = organization;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching organizations:', err);
        this.loading = false;
      }
    });
  }

  onGlobalFilter(event: Event, dt2: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    dt2.filterGlobal(inputValue, 'contains');
  }

  navigateToOrg(orgSlug: string) {
    this.router.navigate([orgSlug], { relativeTo: this.route });
  }
}
