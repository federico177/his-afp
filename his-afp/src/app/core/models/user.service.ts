import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { APIResponse } from './APIResponse.model'; 
import { User, CreateUserRequest, UsernameCheckData } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/users'; 

  private usersState = signal<User[]>([]);

  public users = computed(() => this.usersState());

  loadAllUsers(): void {
    this.http.get<APIResponse<User[]>>(this.apiUrl).subscribe({
      next: (response) => {
        if (response.status === 'success' && response.data) {
          this.usersState.set(response.data);
        }
      },
      error: (err) => console.error('Errore nel caricamento degli operatori:', err)
    });
  }

  createUser(user: CreateUserRequest): Observable<APIResponse<User>> {
    return this.http.post<APIResponse<User>>(this.apiUrl, user).pipe(
      map((response) => {
        if (response.status === 'success') {
          this.loadAllUsers();
        }
        return response;
      })
    );
  }

  checkUsernameAvailability(username: string): Observable<boolean> {
    return this.http.get<APIResponse<UsernameCheckData>>(`${this.apiUrl}/check/${username}`).pipe(
      map(response => {
        return response.status === 'success' && response.data ? response.data.available : false;
      })
    );
  }
}