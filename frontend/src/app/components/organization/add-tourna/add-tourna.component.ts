import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CreateTournamentResponse, Tournament } from '../../../types/tournament';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { CREATE_ORGANIZATION } from '../../../graphql/mutations/organization.mutation';

@Component({
  selector: 'app-add-tourna',
  imports: [
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './add-tourna.component.html',
  styleUrl: './add-tourna.component.scss'
})
export class AddTournaComponent {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() tournamentCreated = new EventEmitter<Tournament>();

  private apollo = inject(Apollo);
  private authService = inject(AuthService);

  tournamentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tournamentForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      abbreviation: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(5)
      ]],
    });
  }

  submit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.value;
  
      // Convert abbreviation to a valid slug
      const slug = formValue.abbreviation
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
        .slice(0, 20); // Ensure max length of 20 characters
  
      const organizerId = this.authService.currentUser?.id; //change
      const variables = {
        input: {
          name: formValue.name,
          slug,
          organizerId
        }
      };
    
      this.apollo.mutate<CreateTournamentResponse>({
        mutation: CREATE_ORGANIZATION,
        variables
      }).subscribe({
        next: ({ data }) => {
          if (data?.createTournament?.success) {
            console.log('Organization creation successful:', data.createTournament.tournament);
            this.tournamentCreated.emit(data.createTournament.tournament);
            this.resetForm();
            this.closeDialog();
          } else {
            console.error('Error:', data?.createTournament?.message);
          }
        },
        error: (error) => console.error('Mutation error:', error)
      });
    } else {
      console.warn('Form is invalid:', this.tournamentForm.errors);
    }
  }

  resetForm(): void {
    this.tournamentForm.reset({
      id: '',
      name: '',
      abbreviation: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
