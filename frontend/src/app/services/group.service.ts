import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Group } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly API_URL = `${environment.apiUrl}/group`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(this.API_URL).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to fetch groups')
        )
      )
    );
  }

  getOne(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.API_URL}/${id}`).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to fetch group')
        )
      )
    );
  }

  getByGroupStage(stageId: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.API_URL}/stage/${stageId}`).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to fetch stage groups')
        )
      )
    );
  }

  create(group: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(this.API_URL, group).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to create group')
        )
      )
    );
  }

  update(id: number, group: Partial<Group>): Observable<Group> {
    return this.http.patch<Group>(`${this.API_URL}/${id}`, group).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to update group')
        )
      )
    );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`).pipe(
      catchError(error =>
        throwError(
          () => new Error(error.error?.message || 'Failed to delete group')
        )
      )
    );
  }
}
