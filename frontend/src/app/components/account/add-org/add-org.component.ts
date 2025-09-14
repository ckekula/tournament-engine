import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Organization } from '../../../types/models';
import { ButtonModule } from 'primeng/button';
import { OrganizationService } from '../../../services/organization.service';

@Component({
  selector: 'app-add-org',
  imports: [
    DialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule
  ],
  templateUrl: './add-org.component.html',
  styleUrl: './add-org.component.scss'
})
export class AddOrgComponent {

  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() organizationCreated = new EventEmitter<Organization>();

  organizationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService
  ) {
    this.organizationForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      abbreviation: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(5)
      ]],
    });
  }

  submit(): void {
    if (this.organizationForm.valid) {
      const formValue = this.organizationForm.value;
  
      // Convert abbreviation to a valid slug
      const slug = formValue.abbreviation
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
        .slice(0, 20); // Ensure max length of 20 characters
  
      this.organizationService.create({
        name: formValue.name,
        slug: slug
      }).subscribe({
        next: (organization) => {
          this.organizationCreated.emit(organization);
          this.resetForm();
          this.closeDialog();
        },
        error: (error) => {
          console.error('Failed to create organization:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }

  resetForm(): void {
    this.organizationForm.reset({
      name: '',
      abbreviation: ''
    });
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
