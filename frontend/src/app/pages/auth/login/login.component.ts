import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import {CheckboxModule} from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderComponent } from "../../../components/shared/header/header.component";
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { LoginInput } from '../../../types/auth';

@Component({
    selector: 'app-login',
    imports: [
        CheckboxModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        FormsModule,
        HeaderComponent,
        FooterComponent
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginInput: LoginInput = { email: '', password: '' };
  errorMsg: string = '';
  isLoading = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login(this.loginInput).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate(['/dashboard']); // Redirect to dashboard after successful login
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMsg = error.message || 'Invalid email or password. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
