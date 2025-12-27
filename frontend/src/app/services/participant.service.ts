import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Participant, Team } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private readonly API_URL = `${environment.apiUrl}/participant`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Participant[]> {
    return this.http.get<Participant[]>(this.API_URL)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to fetch participants'))
        )
      );
  }

  getOne(id: number): Observable<Participant> {
    return this.http.get<Participant>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to fetch participant'))
        )
      );
  }

  getTeamByOrgAndTourna(organizationId: number, tournamentId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.API_URL}/teams/${organizationId}/${tournamentId}`)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to fetch teams'))
        )
      );
  }

  create(participant: Partial<Participant>): Observable<Participant> {
    return this.http.post<Participant>(this.API_URL, participant)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to create participant'))
        )
      );
  }

  createTeam(team: Partial<Team>): Observable<Team> {
    return this.http.post<Team>(this.API_URL + '/team', team)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to create team'))
        )
      );
  }

  update(id: number, participant: Partial<Participant>): Observable<Participant> {
    return this.http.patch<Participant>(`${this.API_URL}/${id}`, participant)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to update participant'))
        )
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error =>
          throwError(() => new Error(error.error?.message || 'Failed to delete participant'))
        )
      );
  }
}
