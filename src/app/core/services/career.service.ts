import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Career } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CareerService {

  private url: string;

  constructor(private http: HttpClient, private api: ApiService) {
    this.url = `${this.api.baseUrl}/carreras`;
  }

  getAll(): Observable<Career[]>  { return this.http.get<Career[]>(this.url); }
  create(c: Career): Observable<Career> { return this.http.post<Career>(this.url, c); }
  update(id: number, c: Career): Observable<Career> { return this.http.put<Career>(`${this.url}/${id}`, c); }
  delete(id: number): Observable<string> { return this.http.delete<string>(`${this.url}/${id}`); }
}
