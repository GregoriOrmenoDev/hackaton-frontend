import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private url: string;

  constructor(private http: HttpClient, private api: ApiService) {
    this.url = `${this.api.baseUrl}/usuarios`;
  }

  getAll(): Observable<Usuario[]>             { return this.http.get<Usuario[]>(this.url); }
  create(u: Usuario): Observable<Usuario>     { return this.http.post<Usuario>(this.url, u); }
  update(id: number, u: Usuario): Observable<Usuario> { return this.http.put<Usuario>(`${this.url}/${id}`, u); }
  delete(id: number): Observable<string>      { return this.http.delete<string>(`${this.url}/${id}`); }
}
