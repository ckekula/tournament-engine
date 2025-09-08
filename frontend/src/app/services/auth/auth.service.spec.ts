import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthResponse, LoginInput, RegisterInput, User } from '../../types/auth';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  const mockApiUrl = 'http://localhost:3000/api';

  const mockUser: User = { 
    id: 1, email: 
    'test@example.com', 
    firstname: 'Test User', 
    lastname: 'User',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockRegisterInput: RegisterInput = { 
    firstname: 'New User', 
    lastname: 'User',
    email: 'existing@example.com', 
    password: 'password123' 
  };

  const mockAccessToken = 'new-token';

  // Mock process.env
  beforeEach(() => {
    process.env = { API_URL: mockApiUrl };
  });

  // Mock localStorage
  let localStorageMock: {
    getItem: jasmine.Spy;
    setItem: jasmine.Spy;
    removeItem: jasmine.Spy;
  };

  beforeEach(() => {
    // Setup localStorage mock
    localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };

    // Define localStorage for the test environment
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: PLATFORM_ID, useValue: 'server' } // Simulate server environment
        ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    
    // Spy on router.navigate
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with null user when no data in localStorage', () => {
      const userSubject = (service as any).currentUserSubject;
      const authSubject = (service as any).isAuthenticatedSubject;
      
      expect(userSubject.value).toBeNull();
      expect(authSubject.value).toBeFalse();
    });
    
    it('should initialize with user data from localStorage if available', () => {
      localStorageMock.getItem.and.callFake((key: string) => {
        if (key === 'auth_token') return 'mock-token';
        if (key === 'current_user') return JSON.stringify(mockUser);
        return null;
      });
      
      // Re-initialize service to trigger constructor with mocked localStorage
      service = TestBed.inject(AuthService);
      
      expect(service.currentUser).toEqual(mockUser);
      expect(service.isLoggedIn()).toBeTrue();
    });
  });

  describe('login', () => {
    it('should send login request and handle successful response', () => {
      const mockLoginInput: LoginInput = { email: 'test@example.com', password: 'password123' };
      const mockResponse: AuthResponse = {
        accessToken: mockAccessToken,
        user: mockUser
      };
      
      service.login(mockLoginInput).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentUser).toEqual(mockResponse.user);
        expect(service.isLoggedIn()).toBeTrue();
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginInput);
      req.flush(mockResponse);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockResponse.accessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockResponse.user));
    });
    
    it('should handle login errors', () => {
      const mockLoginInput: LoginInput = { email: 'test@example.com', password: 'wrong-password' };
      const errorResponse = { status: 401, statusText: 'Unauthorized', error: { message: 'Invalid credentials' } };
      
      service.login(mockLoginInput).subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toBe('Invalid credentials');
        }
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/login`);
      req.flush(errorResponse.error, errorResponse);
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should send registration request and handle successful response', () => {
      const mockResponse: AuthResponse = {
        accessToken: mockAccessToken,
        user: mockUser
      };
      
      service.register(mockRegisterInput).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentUser).toEqual(mockResponse.user);
        expect(service.isLoggedIn()).toBeTrue();
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterInput);
      req.flush(mockResponse);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockResponse.accessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockResponse.user));
    });
    
    it('should handle registration errors', () => {
      const errorResponse = { status: 409, statusText: 'Conflict', error: { message: 'Email already exists' } };
      
      service.register(mockRegisterInput).subscribe({
        next: () => fail('should have failed with 409 error'),
        error: (error) => {
          expect(error.message).toBe('Email already exists');
        }
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/register`);
      req.flush(errorResponse.error, errorResponse);
      
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and update auth state', () => {
      const mockResponse: AuthResponse = {
        accessToken: mockAccessToken,
        user: mockUser
      };
      
      service.refreshToken().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentUser).toEqual(mockResponse.user);
        expect(service.isLoggedIn()).toBeTrue();
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/refresh-token`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockResponse.accessToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockResponse.user));
    });
    
    it('should logout user when token refresh fails', () => {
      const errorResponse = { status: 401, statusText: 'Unauthorized' };
      
      service.refreshToken().subscribe({
        next: () => fail('should have failed with 401 error'),
        error: (error) => {
          expect(error.message).toBe('Your session has expired. Please log in again.');
        }
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/refresh-token`);
      req.flush(null, errorResponse);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('current_user');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getProfile', () => {
    it('should fetch and update user profile', () => {
      
      service.getProfile().subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.currentUser).toEqual(mockUser);
      });
      
      const req = httpMock.expectOne(`${mockApiUrl}/auth/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('current_user', JSON.stringify(mockUser));
    });
  });

  describe('logout', () => {
    it('should clear auth state and redirect to login', () => {
      // Setup authenticated state first
      (service as any).currentUserSubject.next({ id: '1', email: 'test@example.com' });
      (service as any).isAuthenticatedSubject.next(true);
      
      service.logout();
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('current_user');
      expect(service.currentUser).toBeNull();
      expect(service.isLoggedIn()).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('server-side rendering', () => {
    it('should handle localStorage not being available', () => {
      
      // Clear the localStorage mock since it shouldn't be used
      localStorageMock.getItem.calls.reset();
      localStorageMock.setItem.calls.reset();
      localStorageMock.removeItem.calls.reset();
      
      const serverService = TestBed.inject(AuthService);
      
      // Service should still initialize properly
      expect(serverService).toBeTruthy();
      expect(serverService.currentUser).toBeNull();
      expect(serverService.isLoggedIn()).toBeFalse();
      
      // localStorage should not be called
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
      
      // Test that a method that would normally use localStorage works
      serverService.logout();
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });
});