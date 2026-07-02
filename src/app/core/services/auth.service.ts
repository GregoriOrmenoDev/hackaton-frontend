import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Usuario logueado guardado en memoria y localStorage
  private currentUser: Usuario | null = null;
  private STORAGE_KEY = 'techstore_user';

  constructor(private http: HttpClient, private api: ApiService) {
    // Al recargar la página, recupera la sesión del localStorage
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) this.currentUser = JSON.parse(stored);
  }

  // Llama a POST /api/usuarios/login
  login(usuario: string, password: string): Observable<Usuario | null> {
    return this.http.post<Usuario>(`${this.api.baseUrl}/usuarios/login`, { usuario, password }).pipe(
      map(user => {
        this.currentUser = user;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        return user;
      }),
      catchError(() => of(null))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getUser(): Usuario | null  { return this.currentUser; }
  isLoggedIn(): boolean       { return this.currentUser !== null; }
  getRol(): string            { return this.currentUser?.rol ?? ''; }
}
