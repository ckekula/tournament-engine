import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderComponent } from "../../../components/shared/header/header.component";
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { LoginInput } from '../../../types/auth';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-login',
    imports: [
      CheckboxModule,
      ButtonModule,
      RippleModule,
      InputTextModule,
      FormsModule,
      HeaderComponent,
      FooterComponent,
      CommonModule,
      ReactiveFormsModule,
      MessageModule,
      ProgressSpinner
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;
  errorMessages: string[] = [];
  isLoading = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      console.log('Form is invalid');
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessages = [];

    const loginData: LoginInput = this.loginForm.value;
    this.authService.login(loginData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/account']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.handleLoginError(error);
      },
    });
  }

  private handleLoginError(error: any) {
    console.error('Login failed:', error);
    this.errorMessages.push(error?.message || 'Registration failed. Please try again.');
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}
