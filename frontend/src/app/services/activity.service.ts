import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Activity } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly API_URL = `${environment.apiUrl}/activity`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.API_URL)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch activities')))
      );
  }

  getOne(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch activity')))
      );
  }

  getByTournament(tournamentId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.API_URL}/tournament/${tournamentId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch tournament activities')))
      );
  }

  create(activity: Partial<Activity>): Observable<Activity> {
    return this.http.post<Activity>(this.API_URL, activity)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create activity')))
      );
  }

  update(id: number, activity: Partial<Activity>): Observable<Activity> {
    return this.http.patch<Activity>(`${this.API_URL}/${id}`, activity)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to update activity')))
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to delete activity')))
      );
  }
}