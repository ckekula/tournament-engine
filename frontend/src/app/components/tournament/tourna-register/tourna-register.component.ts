import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Organization } from '../../../types/models';
import { OrganizationService } from '../../../services/organization.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../../../services/tournament.service';
import { RegisterOrgInput } from '../../../types/dto';

@Component({
  selector: 'app-tourna-register',
  imports: [
    DialogModule, 
    ButtonModule, 
    SelectModule,
    ReactiveFormsModule,
    CommonModule,
    InputIcon,
    IconField
  ],
  templateUrl: './tourna-register.component.html',
  styleUrl: './tourna-register.component.scss'
})
export class TournaRegisterComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  organizations: Organization[] = [];

  registrationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private tournamentService: TournamentService,
    private fb: FormBuilder
  ) {
    this.registrationForm = this.fb.group({
      organizationId: [null, Validators.required]
    });
  }

  ngOnInit() {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    if (tournamentId) {
      this.tournamentService.getOrganizer(tournamentId).subscribe({
        next: (organizer) => {
          // Remove the organizer from the list of organizations
          this.organizationService.getMyOrganizations().subscribe({
            next: (orgs) => this.organizations = orgs.filter(org => org.id !== organizer.id),
            error: (error) => console.error('Failed to load organizations:', error)
          });
        },
        error: (error) => console.error('Failed to fetch organizer:', error)
      });
    } else {
      console.error('Tournament ID is missing in route parameters.');
    } 
  }

  closeDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.registrationForm.reset();
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const organizationId = this.registrationForm.value.organizationId;
      const tournamentIdParam = this.route.snapshot.paramMap.get('tournamentId');
      if (!tournamentIdParam) {
        console.error('Tournament ID is missing in route parameters.');
        return;
      }
      
      // Wrap organizationId in an object matching RegisterOrgInput
      const registerOrgInput: RegisterOrgInput = { organizationId };
      
      this.tournamentService.registerOrganization(Number(tournamentIdParam), registerOrgInput).subscribe({
        next: () => {
          // Handle success
          this.closeDialog();
        },
        error: (error) => console.error('Registration failed:', error)
      });
      
      // Don't close dialog here - only close on success in the next() callback
      // this.closeDialog(); // REMOVE THIS
    } else {
      // Mark all fields as touched to show validation errors
      this.registrationForm.markAllAsTouched();
    }
  }

  get organizationIdControl() {
    return this.registrationForm.get('organizationId');
  }
}