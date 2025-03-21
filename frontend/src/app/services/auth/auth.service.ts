import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthResponse, LoginInput, RegisterInput, User } from '../../types/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string = `${process.env['API_URL']}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize authentication state from local storage
    const storedUser = localStorage.getItem(this.USER_KEY);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(loginInput: LoginInput): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, loginInput)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  register(registerInput: RegisterInput): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, registerInput)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Registration error', error);
          return throwError(() => new Error(error.error?.message || 'Registration failed'));
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh-token`, {})
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Token refresh error', error);
          // If token refresh fails, log the user out
          this.logout();
          return throwError(() => new Error('Your session has expired. Please log in again.'));
        })
      );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`)
      .pipe(
        tap(user => {
          // Update stored user info if profile is fetched
          this.currentUserSubject.next(user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Get profile error', error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch profile'));
        })
      );
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  // Check if the user is authenticated
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Get the current user
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Get the JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Handle successful authentication
  private handleAuthSuccess(response: AuthResponse): void {
    if (response && response.accessToken) {
      localStorage.setItem(this.TOKEN_KEY, response.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      this.isAuthenticatedSubject.next(true);
    }
  }
}