import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { Stage } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class StageService {
  private readonly API_URL = `${environment.apiUrl}/stage`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stage[]> {
    return this.http.get<Stage[]>(this.API_URL).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to fetch stages'))
      )
    );
  }

  getOne(id: number): Observable<Stage> {
    return this.http.get<Stage>(`${this.API_URL}/${id}`).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to fetch stage'))
      )
    );
  }

  getByEvent(eventId: number): Observable<Stage[]> {
    return this.http.get<Stage[]>(`${this.API_URL}/event/${eventId}`).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to fetch stages by event'))
      )
    );
  }

  create(stage: Partial<Stage>): Observable<Stage> {
    return this.http.post<Stage>(this.API_URL, stage).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to create stage'))
      )
    );
  }

  createGroupStage(stage: Partial<Stage>): Observable<Stage> {
    return this.http.post<Stage>(`${this.API_URL}/group-stage`, stage).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to create group stage'))
      )
    );
  }

  update(id: number, stage: Partial<Stage>): Observable<Stage> {
    return this.http.patch<Stage>(`${this.API_URL}/${id}`, stage).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to update stage'))
      )
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`).pipe(
      catchError(error =>
        throwError(() => new Error(error.error?.message || 'Failed to delete stage'))
      )
    );
  }
}
