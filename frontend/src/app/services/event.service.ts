import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { _Event } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly API_URL = `${environment.apiUrl}/event`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<_Event[]> {
    return this.http.get<_Event[]>(this.API_URL)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch events')))
      );
  }

  getOne(id: number): Observable<_Event> {
    return this.http.get<_Event>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to fetch event with ID ${id}`)))
      );
  }

  getByActivity(activityId: number): Observable<_Event[]> {
    return this.http.get<_Event[]>(`${this.API_URL}/activity/${activityId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to fetch events for activity ID ${activityId}`)))
      );
  }

  create(event: Partial<_Event>): Observable<_Event> {
    return this.http.post<_Event>(this.API_URL, event)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create event')))
      );
  }

  update(id: number, event: Partial<_Event>): Observable<_Event> {
    return this.http.patch<_Event>(`${this.API_URL}/${id}`, event)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to update event with ID ${id}`)))
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to delete event with ID ${id}`)))
      );
  }
}
