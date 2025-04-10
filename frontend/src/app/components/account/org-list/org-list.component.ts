import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Organization } from '../../../types/organization';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddOrgComponent } from '../add-org/add-org.component';
import { OrgCardComponent } from '../org-card/org-card.component';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../../types/auth';
import { GET_ORGANIZATIONS_BY_USER } from '../../../graphql/queries/organization.query';

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
export class OrgListComponent {
  private apollo = inject(Apollo);
  private authService = inject(AuthService);
  private router = inject(Router);

  organizations: Organization[] = [];
  newOrgVisible = false;

  ngOnInit(): void {
    const currentUser: User | null = this.authService.currentUser;

    if (currentUser?.id) {
      this.apollo
        .watchQuery<{ organizationsByUser: Organization[] }>({
          query: GET_ORGANIZATIONS_BY_USER,
          variables: { userId: currentUser.id }
        })
        .valueChanges
        .subscribe(({ data }) => {
          this.organizations = data.organizationsByUser;
        });
    } else {
      // handle unauthenticated case
      console.warn('User is not logged in.');
    }
  }

  toggleNewOrg(): void {
    this.newOrgVisible = true;
  }

  addOrganization(org: Organization): void {
    this.organizations = [...this.organizations, org];
  }

  navigateToOrg(orgAbb: string, orgId: number): void {
    this.router.navigate(['/org', orgAbb, orgId]);
  }
}
