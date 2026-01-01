import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Person } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
    private readonly API_URL = `${environment.apiUrl}/person`;

    constructor(private http: HttpClient) {}

    create(person: Partial<Person>): Observable<Person> {
        return this.http.post<Person>(this.API_URL, person)
        .pipe(
            catchError(error => throwError(() => new Error(error.error?.message || 'Failed to create person')))
        );
    }

    getByOrganization(organizationId: number): Observable<Person[]> {
        return this.http.get<Person[]>(`${this.API_URL}/organization/${organizationId}`)
            .pipe(
                catchError(error => throwError(() => new Error(error.error?.message || 'Failed to fetch persons')))
            );
    }
}