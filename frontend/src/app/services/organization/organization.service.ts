import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environment';
import { Organization } from '../../types/organization';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly API_URL = `${environment.apiUrl}/organization`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.API_URL)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch organizations')))
      );
  }

  getOne(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch organization')))
      );
  }

  getBySlug(slug: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.API_URL}/slug/${slug}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch organization')))
      );
  }

  getByUser(userId: number): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.API_URL}/user/${userId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch user organizations')))
      );
  }

  getMyOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.API_URL}/me`)
        .pipe(
            catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch user organizations')))
        );
  }

  create(organization: Partial<Organization>): Observable<Organization> {
    return this.http.post<Organization>(this.API_URL, organization)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create organization')))
      );
  }

  update(id: number, organization: Partial<Organization>): Observable<Organization> {
    return this.http.patch<Organization>(`${this.API_URL}/${id}`, organization)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to update organization')))
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to delete organization')))
      );
  }

  addAdmin(organizationId: number, userId: number): Observable<Organization> {
    return this.http.post<Organization>(`${this.API_URL}/${organizationId}/admins/${userId}`, {})
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to add admin')))
      );
  }

  removeAdmin(organizationId: number, userId: number): Observable<Organization> {
    return this.http.delete<Organization>(`${this.API_URL}/${organizationId}/admins/${userId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to remove admin')))
      );
  }
}