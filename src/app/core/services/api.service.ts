import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // El proxy de Angular redirige /api → http://localhost:8080
  // En producción (Docker) cambiar a la URL real del backend
  public baseUrl = '/api';
}
