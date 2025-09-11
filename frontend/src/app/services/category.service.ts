import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { Category } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly API_URL = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch categories')))
      );
  }

  getOne(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to fetch category with ID ${id}`)))
      );
  }

  getByActivity(activityId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/activity/${activityId}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to fetch categories for activity ID ${activityId}`)))
      );
  }

  create(category: Partial<Category>, userId: number): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}?userId=${userId}`, category)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create category')))
      );
  }

  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => throwError(() => new Error(error.error?.message || `Failed to delete category with ID ${id}`)))
      );
  }
}
