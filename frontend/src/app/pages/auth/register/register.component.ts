import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../components/shared/header/header.component";
import { FooterComponent } from "../../../components/shared/footer/footer.component";
import { RegisterInput } from '../../../types/auth';

@Component({
    selector: 'app-register',
    imports: [
        CheckboxModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        FormsModule,
        HeaderComponent,
        FooterComponent
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerInput: RegisterInput = {email: '', firstname: '', lastname: '', password: ''};
  errorMsg: string[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  register() {
    this.isLoading = true;
    this.errorMsg = []; // Reset error messages

    this.authService.register(this.registerInput).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
  
        // Automatically login after successful registration
        this.authService.login({
          email: this.registerInput.email,
          password: this.registerInput.password
        }).subscribe({
          next: (loginResponse) => {
            console.log('Login successful', loginResponse);
            this.router.navigate(['/profile']); // Redirect to profile page
          },
          error: (loginError) => {
            console.error('Auto Login failed', loginError);
            this.router.navigate(['/login']); // Redirect to login if auto-login fails
          }
        });
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMsg.push(error.message);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
