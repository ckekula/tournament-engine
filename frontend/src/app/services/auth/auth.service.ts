import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, LoginInput, RegisterInput, User } from '../../types/auth';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;
  
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Initialize with null/false values
    let storedUser = null;
    let hasToken = false;
    
    // Check if we're in browser environment before accessing localStorage
    if (this.isBrowser) {
      storedUser = this.getItemFromStorage(this.USER_KEY);
      hasToken = !!this.getItemFromStorage(this.TOKEN_KEY);
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
    
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(hasToken);
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
          this.setItemInStorage(this.USER_KEY, JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Get profile error', error);
          return throwError(() => new Error(error.error?.message || 'Failed to fetch profile'));
        })
      );
  }

  logout(): void {
    // Clear authentication data
    this.removeItemFromStorage(this.TOKEN_KEY);
    this.removeItemFromStorage(this.USER_KEY);
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
    return this.getItemFromStorage(this.TOKEN_KEY);
  }

  // Handle successful authentication
  private handleAuthSuccess(response: AuthResponse): void {
    if (response && response.accessToken) {
      this.setItemInStorage(this.TOKEN_KEY, response.accessToken);
      this.setItemInStorage(this.USER_KEY, JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  // Safe localStorage methods
  private getItemFromStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setItemInStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeItemFromStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}