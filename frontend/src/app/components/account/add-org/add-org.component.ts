import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Organization, CreateOrganizationResponse } from '../../../types/organization';
import { ButtonModule } from 'primeng/button';
import { Apollo } from 'apollo-angular';
import { CREATE_ORGANIZATION } from '../../../graphql/mutations/organization.mutation';

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

  constructor(private fb: FormBuilder, private apollo: Apollo) {
    this.organizationForm = this.fb.group({
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
    if (this.organizationForm.valid) {
      console.log('Form is valid, proceeding with submission');
      const formValue = this.organizationForm.value;
  
      // Convert abbreviation to a valid slug
      const slug = formValue.abbreviation
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove invalid characters
        .slice(0, 20); // Ensure max length of 20 characters
  
      console.log('Generated slug:', slug);
  
      this.apollo.mutate<CreateOrganizationResponse>({
        mutation: CREATE_ORGANIZATION,
        variables: { 
          input: { 
            name: formValue.name, 
            slug 
          } 
        }
      }).subscribe({
        next: ({ data }) => {
          console.log('Mutation response data:', data);
          if (data?.createOrganization?.success) {
            console.log('Organization creation successful:', data.createOrganization.organization);
            this.organizationCreated.emit(data.createOrganization.organization);
            this.resetForm();
            this.closeDialog();
          } else {
            console.error('Error:', data?.createOrganization?.message);
          }
        },
        error: (error) => console.error('Mutation error:', error)
      });
    } else {
      console.log('Form is invalid, submission aborted');
    }
  }

  resetForm(): void {
    this.organizationForm.reset({
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
