import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Tournament } from '../../../types/models';
import { TournamentService } from '../../../services/tournament.service';
import { ActivatedRoute } from '@angular/router';

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

  tournamentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private route: ActivatedRoute
  ) {
    this.tournamentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      abbreviation: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(10)
      ]],
      season: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10)
      ]]
    });
  }

  submit(): void {
    if (this.tournamentForm.valid) {
      const formValue = this.tournamentForm.value;
      const organizerId = Number(this.route.snapshot.paramMap.get('organizationId'));

      // Convert abbreviation to slug
      const slug = formValue.abbreviation
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
        .slice(0, 20); // Ensure max length of 20 characters

      this.tournamentService.create({
        name: formValue.name,
        slug: slug,
        season: formValue.season,
        organizerId: organizerId
      }).subscribe({
        next: (tournament) => {
          this.tournamentCreated.emit(tournament);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Failed to create tournament:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }

  resetForm(): void {
    this.tournamentForm.reset({
      name: '',
      abbreviation: '',
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
