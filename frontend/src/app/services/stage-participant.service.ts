import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CreateGroupStageParticipantRequest, GroupStageParticipant, Participant, Team } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class StageParticipantService {
  private readonly API_URL = `${environment.apiUrl}/stage-participant`;

  constructor(private http: HttpClient) {}

  createGroupStageParticipant(
    payload: CreateGroupStageParticipantRequest
  ): Observable<GroupStageParticipant[]> {
    return this.http.post<GroupStageParticipant[]>(this.API_URL, payload)
      .pipe(
        catchError(error =>
          throwError(() =>
            new Error(error.error?.message || 'Failed to create group stage participant')
          )
        )
      );
  }
}
