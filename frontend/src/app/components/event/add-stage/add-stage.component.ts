import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Stage } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { StageService } from '../../../services/stage.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-stage',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    ToggleSwitchModule
  ],
  templateUrl: './add-stage.component.html',
  styleUrl: './add-stage.component.scss'
})
export class AddStageComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() stageCreated = new EventEmitter<Stage>();

  stageForm: FormGroup;

  formats = [
    { name: 'Single Elimination', value: 'Single Elimination' },
    { name: 'Double Elimination', value: 'Double Elimination' },
    { name: 'Round Robin', value: 'Round Robin' },
    { name: 'Swiss System', value: 'Swiss System' },
    { name: 'Ladder System', value: 'Ladder System' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private stageService: StageService
  ) {
    this.stageForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      format: ['', [Validators.required]],
      isGroupStage: [false]
    });
  }

  submit(): void {
    if (this.stageForm.valid) {
      const formValue = this.stageForm.value;
      const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
      const isGroupStage: boolean = this.stageForm.value.isGroupStage;

      if(isGroupStage) {
        this.stageService.createGroupStage(
          {...formValue, eventId}).subscribe({
          next: (stage) => {
            this.stageCreated.emit(stage);
            this.resetForm();
            this.closeDialog();
          },
          error: (err) => {
            console.error('Error creating stage:', err);
          }
        });
      } else {
        this.stageService.create(
          {...formValue, eventId}).subscribe({
          next: (stage) => {
            console.log("creating stage:", stage)
            console.log("group stage:", isGroupStage)
            this.stageCreated.emit(stage);
            this.resetForm();
            this.closeDialog();
          },
          error: (err) => {
            console.error('Error creating stage:', err);
          }
        });
      }
    }
  }

  resetForm(): void {
    this.stageForm.reset({
      name: '',
      format: '',
      isGroupStage: false
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
