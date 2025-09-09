import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Organization } from '../../../types/organization';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddOrgComponent } from '../add-org/add-org.component';
import { OrgCardComponent } from '../org-card/org-card.component';
import { OrganizationService } from '../../../services/organization/organization.service';

@Component({
  selector: 'app-org-list',
  imports: [
    CommonModule,
    ButtonModule,
    AddOrgComponent,
    OrgCardComponent
  ],
  templateUrl: './org-list.component.html',
  styleUrl: './org-list.component.scss'
})
export class OrgListComponent implements OnInit {
  organizations: Organization[] = [];

  constructor(
    private router: Router,
    private organizationService: OrganizationService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  private loadOrganizations(): void {
    this.organizationService.getMyOrganizations().subscribe({
      next: (orgs) => this.organizations = orgs,
      error: (error) => console.error('Failed to load organizations:', error)
    });
  }

  newOrgVisible = false;

  toggleNewOrg(): void {
    this.newOrgVisible = true;
  }

  addOrganization(org: Organization): void {
    this.organizations = [...this.organizations, org];
  }

  navigateToOrg(slug: string, orgId: number): void {
    this.router.navigate(['/org', slug, orgId]);
  }
}
