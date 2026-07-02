import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Venta, VentaRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class VentaService {

  private url: string;

  constructor(private http: HttpClient, private api: ApiService) {
    this.url = `${this.api.baseUrl}/matriculas`;
  }

  getAll(): Observable<Venta[]>                { return this.http.get<Venta[]>(this.url); }
  getById(id: number): Observable<Venta>       { return this.http.get<Venta>(`${this.url}/${id}`); }
  create(v: VentaRequest): Observable<Venta>   { return this.http.post<Venta>(this.url, v); }
}
