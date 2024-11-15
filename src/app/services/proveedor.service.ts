// src/app/services/proveedor.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Función original
  getProveedores(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/table/proveedor`);
  }

  // Nueva función que mapea la respuesta para obtener solo los datos
  getProveedoresData(): Observable<any[]> {
    return this.getProveedores().pipe(
      map(response => response.data) // Extrae solo la data de la respuesta
    );
  }
}