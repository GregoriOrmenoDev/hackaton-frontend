import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Producto } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private url: string;

  constructor(private http: HttpClient, private api: ApiService) {
    this.url = `${this.api.baseUrl}/productos`;
  }

  getAll(): Observable<Producto[]>             { return this.http.get<Producto[]>(this.url); }
  getById(id: number): Observable<Producto>    { return this.http.get<Producto>(`${this.url}/${id}`); }
  create(p: Producto): Observable<Producto>    { return this.http.post<Producto>(this.url, p); }
  update(id: number, p: Producto): Observable<Producto> { return this.http.put<Producto>(`${this.url}/${id}`, p); }
  delete(id: number): Observable<string>       { return this.http.delete<string>(`${this.url}/${id}`); }

  // Exportaciones — devuelven Blob para descarga directa en el navegador
  exportarExcel(): Observable<Blob> {
    return this.http.get(`${this.url}/exportar/excel`, { responseType: 'blob' });
  }
  exportarPDF(): Observable<Blob> {
    return this.http.get(`${this.url}/exportar/pdf`, { responseType: 'blob' });
  }

  // Importaciones — envían el archivo como FormData
  importarCSV(archivo: File): Observable<string> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post<string>(`${this.url}/importar/csv`, form);
  }
  importarExcel(archivo: File): Observable<string> {
    const form = new FormData();
    form.append('archivo', archivo);
    return this.http.post<string>(`${this.url}/importar/excel`, form);
  }
}
