import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { Tournament } from '../types/models';
import { RegisterOrgInput } from '../types/dto';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  private readonly API_URL = `${environment.apiUrl}/tournament`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(this.API_URL)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch tournaments')))
      );
  }

  getOne(id: number): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch tournament')))
      );
  }

  getBySlug(slug: string): Observable<Tournament> {
    return this.http.get<Tournament>(`${this.API_URL}/slug/${slug}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch tournament')))
      );
  }

  getByOrganization(organizationId: number): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`${this.API_URL}/organization/${organizationId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch organization tournaments')))
      );
  }

  registerOrganization(tournamentId: number, registerOrgInput: RegisterOrgInput): Observable<Tournament> {
    return this.http.post<Tournament>(`${this.API_URL}/${tournamentId}/register-organization`, registerOrgInput)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to register organization to tournament')))
      );
  }

  create(tournament: Partial<Tournament>): Observable<Tournament> {
    return this.http.post<Tournament>(this.API_URL, tournament)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create tournament')))
      );
  }

  update(id: number, tournament: Partial<Tournament>): Observable<Tournament> {
    return this.http.patch<Tournament>(`${this.API_URL}/${id}`, tournament)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to update tournament')))
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to delete tournament')))
      );
  }
}