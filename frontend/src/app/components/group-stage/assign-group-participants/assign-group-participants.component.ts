import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { Group, GroupStageParticipant, Participant } from '../../../types/models';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../../services/participant.service';
import { CommonModule } from '@angular/common';
import { StageParticipantService } from '../../../services/stage-participant.service';

@Component({
  selector: 'app-assign-group-participants',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    MultiSelectModule
  ],
  templateUrl: './assign-group-participants.component.html',
  styleUrl: './assign-group-participants.component.scss'
})
export class AssignGroupParticipantsComponent implements OnInit {
  @Input() groupId!: number;
  @Input() stageId!: number;
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() participantAssigned = new EventEmitter<GroupStageParticipant[]>();

  groupParticipantForm: FormGroup;
  participants: Participant[] = [];
  group!: Group;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private participantService: ParticipantService,
    private stageParticipantService: StageParticipantService
  ) {
    this.groupParticipantForm = this.fb.group({
      participants: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    this.loading = true;
    this.participantService.getParticipantsByEvent(eventId).subscribe({
      next: (participants) => {
        this.participants = participants;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.groupParticipantForm.valid) {
      const formValue = this.groupParticipantForm.value;
      
      this.stageParticipantService.createGroupStageParticipant({
        ...formValue,
        groupId: this.groupId,
        stageId: this.stageId
      }).subscribe({
        next: (stageParticipant) => {
          this.participantAssigned.emit(stageParticipant);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error creating event:', error);
        }
      });
    }
  }

  resetForm(): void {
    this.groupParticipantForm.reset({
      participants: []
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
