import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { _Event, Activity, Team } from '../../../../types/models';
import { EventService } from '../../../../services/event.service';
import { ParticipantService } from '../../../../services/participant.service';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { ActivityService } from '../../../../services/activity.service';
import { SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-add-team',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule,
    SelectModule
  ],
  templateUrl: './add-team.component.html',
  styleUrl: './add-team.component.scss'
})
export class AddTeamComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() teamCreated = new EventEmitter<Team>();

  teamForm: FormGroup;
  activities: Activity[] = [];
  events: _Event[] = [];
  groupedEvents: SelectItemGroup[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private participantService: ParticipantService
  ) {
    this.teamForm = this.fb.group({
      name: [''],
      events: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const tournamentId = Number(this.route.snapshot.paramMap.get('tournamentId'));
    this.loading = true;
    this.activityService.getByTournament(tournamentId).subscribe({
      next: (activities) => {
        this.activities = activities;
        console.log('Fetched activities:', activities);
        this.groupedEvents = activities
          .filter(activity => activity.events && activity.events.length > 0) // Filter out activities without events
          .map(activity => ({
            label: activity.name,
            value: activity.id,
            items: activity.events.map(event => ({
              label: event.name,
              value: event
            }))
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching events:', err);
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.value;
      const organizationId = Number(this.route.snapshot.paramMap.get('organizationId'));

      this.participantService.createTeam({
        ...formValue,
        organizationId,
      }).subscribe({
        next: (team) => {
          this.teamCreated.emit(team);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating team:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.teamForm.reset({
      name: '',
      events: []
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
