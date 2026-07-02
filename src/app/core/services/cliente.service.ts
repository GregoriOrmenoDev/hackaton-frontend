import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Cliente } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private url: string;

  constructor(private http: HttpClient, private api: ApiService) {
    this.url = `${this.api.baseUrl}/clientes`;
  }

  getAll(): Observable<Cliente[]>             { return this.http.get<Cliente[]>(this.url); }
  getById(id: number): Observable<Cliente>    { return this.http.get<Cliente>(`${this.url}/${id}`); }
  create(c: Cliente): Observable<Cliente>     { return this.http.post<Cliente>(this.url, c); }
  update(id: number, c: Cliente): Observable<Cliente> { return this.http.put<Cliente>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<string>      { return this.http.delete<string>(`${this.url}/${id}`); }
}
